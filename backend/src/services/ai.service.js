import Groq from "groq-sdk";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import * as eventService from "./event.service.js";
import * as bookingService from "./booking.service.js";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export const AgentState = Annotation.Root({
  userId: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => null,
  }),
  message: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => "",
  }),
  history: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => [],
  }),
  intent: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => ({ action: "generalResponse", params: {} }),
  }),
  toolResult: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => null,
  }),
  response: Annotation({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => "",
  }),
});

const fallbackClassifyIntent = (message) => {
  const q = message.toLowerCase();

  if (
    q.includes("my booking") ||
    q.includes("my ticket") ||
    q.includes("what have i booked") ||
    q.includes("show my bookings") ||
    q.includes("booked events") ||
    q.includes("my reservations")
  ) {
    return { action: "getUserBookings", params: {} };
  }

  const idMatch = q.match(/event\s*(?:#|id)?\s*(\d+)/i) || q.match(/\b(\d+)\b/);
  if (
    (q.includes("available") || q.includes("seat") || q.includes("ticket left")) &&
    idMatch
  ) {
    return {
      action: "checkEventAvailability",
      params: { eventId: parseInt(idMatch[1], 10) },
    };
  }

  const isSearch =
    q.includes("find") ||
    q.includes("show") ||
    q.includes("search") ||
    q.includes("event") ||
    q.includes("under") ||
    q.includes("weekend") ||
    q.includes("react") ||
    q.includes("tech") ||
    q.includes("music") ||
    q.includes("ranchi") ||
    q.includes("bangalore") ||
    q.includes("delhi") ||
    q.includes("recommend");

  if (isSearch) {
    const params = {};
    if (q.includes("ranchi")) params.location = "Ranchi";
    if (q.includes("bangalore") || q.includes("bengaluru")) params.location = "Bangalore";
    if (q.includes("delhi")) params.location = "Delhi";
    if (q.includes("react")) params.search = "React";
    if (q.includes("tech") || q.includes("technology")) params.category = "Technology";
    if (q.includes("music")) params.category = "Music";
    if (q.includes("weekend")) params.weekend = true;

    const priceMatch =
      q.match(/(?:under|below|less than|within)\s*(?:₹|rs\.?|rupees)?\s*(\d+)/i) ||
      q.match(/(\d+)\s*(?:₹|rs\.?|rupees)?\s*(?:under|or less)/i);
    if (priceMatch) {
      params.maxPrice = parseFloat(priceMatch[1]);
    }

    return { action: "searchEvents", params };
  }

  return { action: "generalResponse", params: {} };
};

const understandRequestNode = async (state) => {
  const { message, history } = state;

  if (!groq) {
    return { intent: fallbackClassifyIntent(message) };
  }

  const systemPrompt = `You are the Eventify Intent Classifier.
Classify the user query into EXACTLY ONE of the following actions:
1. "searchEvents": User wants to discover, find, list, or filter events.
2. "getUserBookings": User asks to see their personal bookings, tickets, or booking status.
3. "checkEventAvailability": User asks if a specific event is available or has seats left.
4. "generalResponse": Greetings, platform questions (how to book, refund policy, organizer guide).

Output JSON format:
{
  "action": "searchEvents" | "getUserBookings" | "checkEventAvailability" | "generalResponse",
  "params": { ... }
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-4).map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return {
      intent: {
        action: parsed.action || "generalResponse",
        params: parsed.params || {},
      },
    };
  } catch {
    return { intent: fallbackClassifyIntent(message) };
  }
};

const searchEventsNode = async (state) => {
  const { intent, message } = state;
  const params = intent?.params || {};

  try {
    const filters = { page: 1, limit: 10 };

    if (params.search) filters.search = params.search;
    if (params.category) filters.category = params.category;
    if (params.location) filters.location = params.location;
    if (params.maxPrice != null) filters.maxPrice = Number(params.maxPrice);
    if (params.minPrice != null) filters.minPrice = Number(params.minPrice);

    const qLower = message.toLowerCase();
    const isWeekend = params.weekend || qLower.includes("weekend");

    const result = await eventService.listEvents(filters);
    let events = result.events || [];

    if (isWeekend) {
      events = events.filter((e) => {
        const d = new Date(e.event_date);
        const localDateStr = d.toLocaleDateString("en-CA");
        const localDate = new Date(localDateStr + "T00:00:00");
        const day = localDate.getDay();
        const diffDays = Math.round((localDate.getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000);
        return (day === 0 || day === 6) && diffDays >= 0 && diffDays <= 7;
      });
    }

    if (params.availableOnly || qLower.includes("seats available") || qLower.includes("with seats")) {
      events = events.filter((e) => Number(e.available_seats) > 0);
    }

    return {
      toolResult: {
        success: true,
        tool: "searchEvents",
        total: events.length,
        events: events.map((e) => ({
          id: e.id,
          name: e.name,
          category: e.category,
          location: e.location,
          event_date: new Date(e.event_date).toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          event_time: e.event_time?.slice(0, 5) || "TBD",
          price: Number(e.price),
          available_seats: e.available_seats,
          total_seats: e.total_seats,
        })),
        criteria: params,
      },
    };
  } catch (err) {
    return {
      toolResult: {
        success: false,
        tool: "searchEvents",
        error: err.message,
        events: [],
      },
    };
  }
};

const getUserBookingsNode = async (state) => {
  const { userId } = state;

  if (!userId) {
    return {
      toolResult: {
        success: false,
        tool: "getUserBookings",
        authenticated: false,
        message: "User is not logged in. Tell the user to log in to view their bookings.",
      },
    };
  }

  try {
    const bookings = await bookingService.getBookingsByUser(userId);
    return {
      toolResult: {
        success: true,
        tool: "getUserBookings",
        authenticated: true,
        total: bookings.length,
        bookings: bookings.map((b) => ({
          bookingId: b.id,
          eventName: b.event_name,
          location: b.location,
          eventDate: new Date(b.event_date).toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          eventTime: b.event_time?.slice(0, 5) || "TBD",
          tickets: b.tickets,
          totalAmount: Number(b.total_amount),
          status: b.status,
        })),
      },
    };
  } catch (err) {
    return {
      toolResult: {
        success: false,
        tool: "getUserBookings",
        authenticated: true,
        error: err.message,
        bookings: [],
      },
    };
  }
};

const checkEventAvailabilityNode = async (state) => {
  const { intent, message } = state;
  let eventId = intent?.params?.eventId;

  if (!eventId) {
    const idMatch = message.match(/\b(\d+)\b/);
    if (idMatch) eventId = parseInt(idMatch[1], 10);
  }

  if (!eventId || isNaN(eventId)) {
    return {
      toolResult: {
        success: false,
        tool: "checkEventAvailability",
        found: false,
        message: "Please specify an event ID (e.g., 'Is event 1 available?') to check its seat availability.",
      },
    };
  }

  try {
    const event = await eventService.getEventById(Number(eventId));
    return {
      toolResult: {
        success: true,
        tool: "checkEventAvailability",
        found: true,
        event: {
          id: event.id,
          name: event.name,
          location: event.location,
          event_date: new Date(event.event_date).toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          price: Number(event.price),
          available_seats: event.available_seats,
          total_seats: event.total_seats,
          isAvailable: event.available_seats > 0,
        },
      },
    };
  } catch {
    return {
      toolResult: {
        success: false,
        tool: "checkEventAvailability",
        found: false,
        eventId,
        message: `Event with ID ${eventId} was not found in the database.`,
      },
    };
  }
};

const generalResponseNode = async () => {
  return {
    toolResult: {
      success: true,
      tool: "generalResponse",
      platformInfo: {
        name: "Eventify",
        description: "Eventify is an AI-powered event discovery and ticket booking platform.",
        bookingSteps: [
          "1. Explore events on the Events page or ask me for recommendations.",
          "2. Choose an event and click 'Book Tickets'.",
          "3. Pay securely via Razorpay (UPI, Credit/Debit Cards, Net Banking).",
          "4. Access and download your confirmed tickets in your Dashboard.",
        ],
        organizerSteps: [
          "1. Register or log in with an Organizer account.",
          "2. Navigate to Organizer Dashboard in the top navigation.",
          "3. Click 'Create Event', enter details, venue, ticket price, and seat quota.",
          "4. Publish and monitor ticket sales, revenue, and attendees in real time.",
        ],
      },
    },
  };
};

const routeAction = (state) => {
  const action = state.intent?.action;
  switch (action) {
    case "searchEvents":
      return "searchEvents";
    case "getUserBookings":
      return "getUserBookings";
    case "checkEventAvailability":
      return "checkEventAvailability";
    case "generalResponse":
    default:
      return "generalResponse";
  }
};

const generateResponseNode = async (state) => {
  const { message, history, toolResult } = state;

  const buildFallbackAnswer = () => {
    if (!toolResult) {
      return "Hello! I am your Eventify AI Assistant. You can ask me to find events, check ticket availability, or view your bookings.";
    }

    if (toolResult.tool === "searchEvents") {
      const events = toolResult.events || [];
      if (events.length === 0) {
        return "I couldn't find any events matching your criteria right now. Feel free to search with different keywords, locations, or dates!";
      }
      const list = events
        .map(
          (e) =>
            `• **${e.name}** (${e.category})\n  📍 ${e.location} | 📅 ${e.event_date} at ${e.event_time}\n  💰 ₹${e.price.toLocaleString("en-IN")} | 🎟️ ${e.available_seats} / ${e.total_seats} seats available`
        )
        .join("\n\n");
      return `Here are the events I found for you:\n\n${list}\n\nYou can view full details and book tickets on our Events page!`;
    }

    if (toolResult.tool === "getUserBookings") {
      if (!toolResult.authenticated) {
        return "You need to be logged in to view your bookings. Please sign in to your Eventify account to check your ticket history!";
      }
      const bookings = toolResult.bookings || [];
      if (bookings.length === 0) {
        return "You don't have any bookings yet. Check out our Events page to book your first event!";
      }
      const list = bookings
        .map(
          (b) =>
            `• **${b.eventName}** (Booking #${b.bookingId})\n  📍 ${b.location} | 📅 ${b.eventDate} at ${b.eventTime}\n  🎟️ ${b.tickets} ticket(s) • Total: ₹${b.totalAmount.toLocaleString("en-IN")} • Status: **${b.status}**`
        )
        .join("\n\n");
      return `Here are your booked events:\n\n${list}`;
    }

    if (toolResult.tool === "checkEventAvailability") {
      if (!toolResult.found) {
        return toolResult.message || "I couldn't find an event with that ID. Please check the event ID and try again.";
      }
      const e = toolResult.event;
      if (e.available_seats <= 0) {
        return `**${e.name}** (Event #${e.id}) is currently **Sold Out**! All ${e.total_seats} seats have been reserved.`;
      }
      return `Yes! **${e.name}** (Event #${e.id}) is available with **${e.available_seats} out of ${e.total_seats} seats** remaining at ₹${e.price.toLocaleString("en-IN")} per ticket.`;
    }

    if (toolResult.tool === "generalResponse") {
      const q = message.toLowerCase();
      if (q.includes("book") || q.includes("how to")) {
        return "To book an event on Eventify:\n1. Browse our Events page and choose an event.\n2. Select your desired number of tickets.\n3. Click 'Book Now' and complete secure payment via Razorpay.\n4. View your confirmed tickets anytime in your Dashboard!";
      }
      if (q.includes("host") || q.includes("organizer") || q.includes("create")) {
        return "To host an event on Eventify:\n1. Register or log in with an Organizer account.\n2. Navigate to your Organizer Dashboard from the top menu.\n3. Click 'Create Event' and enter event details, venue, date, and ticket price.\n4. Publish and start selling tickets immediately!";
      }
      return "Hi there! 👋 I am your Eventify AI Assistant. You can ask me to find events, check seat availability, or view your bookings.";
    }

    return "I'm here to help you with events, tickets, and bookings on Eventify! How can I assist you today?";
  };

  if (!groq) {
    return { response: buildFallbackAnswer() };
  }

  try {
    const systemPrompt = `You are the Eventify AI assistant, an intelligent, helpful, and concise assistant for the Eventify event discovery and booking platform.

Context from the database:
${JSON.stringify(toolResult, null, 2)}

Instructions:
- Answer the user's message accurately using the provided context from database.
- Respond in conversational markdown text only. DO NOT attempt to call any tools or output tool syntax.
- If toolResult indicates authenticated: false, politely ask the user to log in.
- Present events cleanly with bullet points, names, dates, locations, prices in INR (₹), and remaining seats.
- Keep formatting clean using standard markdown with bolding and bullet points. Do not include raw JSON.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-4).map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    return { response: reply || buildFallbackAnswer() };
  } catch {
    return { response: buildFallbackAnswer() };
  }
};

const workflow = new StateGraph(AgentState)
  .addNode("understandRequest", understandRequestNode)
  .addNode("searchEvents", searchEventsNode)
  .addNode("getUserBookings", getUserBookingsNode)
  .addNode("checkEventAvailability", checkEventAvailabilityNode)
  .addNode("generalResponse", generalResponseNode)
  .addNode("generateResponse", generateResponseNode)
  .addEdge(START, "understandRequest")
  .addConditionalEdges("understandRequest", routeAction, {
    searchEvents: "searchEvents",
    getUserBookings: "getUserBookings",
    checkEventAvailability: "checkEventAvailability",
    generalResponse: "generalResponse",
  })
  .addEdge("searchEvents", "generateResponse")
  .addEdge("getUserBookings", "generateResponse")
  .addEdge("checkEventAvailability", "generateResponse")
  .addEdge("generalResponse", "generateResponse")
  .addEdge("generateResponse", END);

export const eventifyAgent = workflow.compile();

export const chatWithAgent = async ({ message, history = [], userId = null }) => {
  const initialState = {
    userId,
    message,
    history,
    intent: { action: "generalResponse", params: {} },
    toolResult: null,
    response: "",
  };

  const finalState = await eventifyAgent.invoke(initialState);
  return finalState.response;
};

export const chatWithAssistant = (message, history = []) =>
  chatWithAgent({ message, history, userId: null });

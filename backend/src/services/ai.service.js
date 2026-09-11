import Groq from "groq-sdk";
import { query } from "../db/db.js";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Helper to get upcoming events as context for the AI
const getEventContext = async () => {
  try {
    const result = await query(
      `SELECT name, description, category, location, event_date, event_time, price, available_seats
       FROM events
       WHERE event_date >= CURRENT_DATE
       ORDER BY event_date ASC
       LIMIT 50`
    );
    return result.rows;
  } catch {
    return [];
  }
};

// Fallback response generator when external AI API is not configured or unavailable
const generateFallbackResponse = (message, events) => {
  const queryLower = message.toLowerCase();

  // Search in events list
  const matches = events.filter((e) => {
    return (
      e.name.toLowerCase().includes(queryLower) ||
      e.category.toLowerCase().includes(queryLower) ||
      e.location.toLowerCase().includes(queryLower) ||
      e.description.toLowerCase().includes(queryLower)
    );
  });

  if (matches.length > 0) {
    const list = matches
      .slice(0, 3)
      .map(
        (e) =>
          `• **${e.name}** (${e.category}) in ${e.location} on ${new Date(e.event_date).toLocaleDateString("en-IN")} at ${e.event_time.slice(0, 5)} — ₹${Number(e.price).toLocaleString("en-IN")} (${e.available_seats} seats left)`
      )
      .join("\n");
    return `Here are some matching events I found:\n\n${list}\n\nYou can view full details and book tickets on our Events page!`;
  }

  if (queryLower.includes("how to book") || queryLower.includes("booking")) {
    return "To book an event on Eventify:\n1. Browse our Events page and choose an event.\n2. Select your desired number of tickets.\n3. Click 'Book Now' and complete secure payment via Razorpay.\n4. View your confirmed tickets anytime in your Dashboard!";
  }

  if (queryLower.includes("organizer") || queryLower.includes("host") || queryLower.includes("create event")) {
    return "To host an event on Eventify, register with an 'Organizer' account. Once logged in, visit the Organizer Dashboard to create, publish, and manage your events and track bookings!";
  }

  if (queryLower.includes("price") || queryLower.includes("cost") || queryLower.includes("free")) {
    if (events.length > 0) {
      const sample = events
        .slice(0, 3)
        .map((e) => `• **${e.name}**: ₹${Number(e.price).toLocaleString("en-IN")}`)
        .join("\n");
      return `Here are ticket prices for some upcoming events:\n\n${sample}\n\nCheck out the Events page for all pricing details.`;
    }
  }

  if (events.length > 0) {
    const featured = events
      .slice(0, 3)
      .map((e) => `• **${e.name}** (${e.category}) in ${e.location} — ₹${Number(e.price).toLocaleString("en-IN")}`)
      .join("\n");
    return `I'm here to help! Here are a few popular upcoming events:\n\n${featured}\n\nFeel free to ask about specific categories (Music, Tech, Sports, etc.), locations, or how to book!`;
  }

  return "Welcome to Eventify! You can discover exciting upcoming events, book tickets, or create and manage your own events as an organizer. What would you like to explore today?";
};

// Main chat handler with Groq LLM and robust fallback
export const chatWithAssistant = async (message, history = []) => {
  const events = await getEventContext();

  if (!groq) {
    return generateFallbackResponse(message, events);
  }

  try {
    const systemPrompt = `You are the Eventify AI assistant, an intelligent and friendly assistant for the Eventify event discovery and booking platform.
Platform context:
- Eventify is a SaaS platform where users can discover and book tickets for music concerts, art exhibitions, tech conferences, sports tournaments, food festivals, and workshops.
- Users can browse events, filter by category/location/date/price, book seats, and pay securely via Razorpay.
- Organizers can create and manage events, track seat capacity, revenue, and attendee lists from their dashboard.

Live upcoming events in database:
${JSON.stringify(events, null, 2)}

Instructions:
- Answer the user's question accurately, concisely, and helpfully.
- When recommending events, use the live events provided above with accurate names, categories, dates, locations, and prices in INR (₹).
- If the user asks general questions about Eventify (how to book, how to become an organizer, account questions, payment methods), provide clear, step-by-step guidance.
- If no events match a specific query, politely let them know and suggest browsing other available categories or checking back soon.
- Keep responses friendly, modern, and engaging with clean markdown formatting.`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ],
      temperature: 0.5,
      max_tokens: 600,
    });

    return completion.choices[0]?.message?.content ?? generateFallbackResponse(message, events);
  } catch (err) {
    console.error("Groq AI API error (falling back):", err.message);
    return generateFallbackResponse(message, events);
  }
};

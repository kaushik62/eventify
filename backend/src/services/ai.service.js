import Groq from "groq-sdk";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

import * as eventService from "./event.service.js";
import * as bookingService from "./booking.service.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const AgentState = Annotation.Root({
  userId: Annotation(),
  message: Annotation(),
  history: Annotation(),
  intent: Annotation(),
  result: Annotation(),
  response: Annotation(),
});

const understandRequest = async (state) => {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `
You are an intent classifier for an event booking application.

Choose exactly one action:
- searchEvents
- getUserBookings
- checkEventAvailability
- generalResponse

Extract relevant parameters from the user's message.

For searchEvents, use:
{
  "search": "string or null",
  "category": "string or null",
  "location": "string or null",
  "minPrice": "number or null",
  "maxPrice": "number or null",
  "weekend": "boolean",
  "availableOnly": "boolean"
}

For other actions, extract the relevant event ID or booking
parameters when provided.

If a required detail is missing, use null rather than
inventing a value.

DATABASE ACCESS RULES:
- The agent has read-only database access.
- Only SELECT operations are permitted.
- Never INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE,
  or execute any operation that modifies database data
  or schema.
- Never create, modify, or delete database records.
- Only retrieve information required to fulfill the user's request.
- If the user requests a write operation, do not perform it.
  Return generalResponse instead.

Return a JSON object with:
{
  "action": "...",
  "params": {}
}
`,
      },
      ...state.history.slice(-4),
      {
        role: "user",
        content: `${JSON.stringify(state.message)}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = response.choices[0].message.content;

  return {
    intent: JSON.parse(result),
  };
};

const searchEvents = async (state) => {
  const { params } = state.intent;

  const filters = {
    page: 1,
    limit: 10,
    ...(params.search && { search: params.search }),
    ...(params.category && { category: params.category }),
    ...(params.location && { location: params.location }),
    ...(params.maxPrice != null && { maxPrice: Number(params.maxPrice) }),
    ...(params.minPrice != null && { minPrice: Number(params.minPrice) }),
  };

  const result = await eventService.listEvents(filters);
  let events = result.events || [];

  if (params.weekend) {
    events = events.filter((event) => {
      const date = new Date(event.event_date);
      const day = date.getDay();

      return day === 0 || day === 6;
    });
  }

  if (params.availableOnly) {
    events = events.filter(
      (event) => Number(event.available_seats) > 0
    );
  }

  return { result: events };
};

const getUserBookings = async (state) => {
  if (!state.userId) {
    return {
      result: {
        error: "Please login to view your bookings.",
      },
    };
  }

  const bookings = await bookingService.getBookingsByUser(
    state.userId
  );

  return { result: bookings };
};

const checkEventAvailability = async (state) => {
  const eventId = state.intent.params.eventId;

  if (!eventId) {
    return {
      result: {
        error: "Please provide an event ID.",
      },
    };
  }

  const event = await eventService.getEventById(eventId);

  return { result: event };
};

const generalResponse = async () => {
  return {
    result: "Eventify is an event discovery and booking platform.",
  };
};

const routeRequest = (state) => {
  return state.intent.action;
};

const generateResponse = async (state) => {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",

        content: `
You are a helpful AI assistant for an event booking platform.

Answer the user's latest message using the provided result and conversation history.

Instructions:
- Give accurate, clear, and relevant answers.
- Use the provided result as the source of truth for event details, availability, and booking information.
- Never invent events, prices, dates, locations, availability, or booking details.
- If the result is empty or does not contain the requested information, clearly inform the user.
- Use conversation history to understand follow-up questions and maintain context.
- Keep responses concise, friendly, and conversational.
- Answer only what the user asks.
- If the user's request is ambiguous, ask a brief clarifying question.
- Never claim a booking has been made or cancelled unless the result confirms it.

Formatting rules:
- Output plain text only.
- Do not use Markdown formatting.
- Never use asterisks for bold or italic text.
- Never use Markdown headings with # symbols.
- Do not wrap words, event names, or phrases in special formatting characters.
- Use simple numbered lists or hyphens when needed.
- Do not include Markdown tables or code blocks.
- Keep the response readable and natural.

Example of correct formatting:
Eventify is an AI-powered event discovery and ticket booking platform.

You can explore events, book tickets, and manage your bookings.

Example of incorrect formatting:
**Eventify** is an AI-powered event discovery and ticket booking platform.
## How it works
`

        ,
      },
      ...state.history.slice(-4),
      {
        role: "user",
        content: `
          User's latest message: ${state.message}
          Result: ${JSON.stringify(state.result)}
        `,
      },
    ],
  });

  const content = response.choices[0].message.content;

  return {
    response: content,
  };
};

const workflow = new StateGraph(AgentState)
  .addNode("understandRequest", understandRequest)
  .addNode("searchEvents", searchEvents)
  .addNode("getUserBookings", getUserBookings)
  .addNode("checkEventAvailability", checkEventAvailability)
  .addNode("generalResponse", generalResponse)
  .addNode("generateResponse", generateResponse)

  .addEdge(START, "understandRequest")

  .addConditionalEdges(
    "understandRequest",
    routeRequest,
    {
      searchEvents: "searchEvents",
      getUserBookings: "getUserBookings",
      checkEventAvailability: "checkEventAvailability",
      generalResponse: "generalResponse",
    }
  )

  .addEdge("searchEvents", "generateResponse")
  .addEdge("getUserBookings", "generateResponse")
  .addEdge("checkEventAvailability", "generateResponse")
  .addEdge("generalResponse", "generateResponse")

  .addEdge("generateResponse", END);

const agent = workflow.compile();

export const chatWithAgent = async ({
  message,
  history = [],
  userId = null,
}) => {
  const result = await agent.invoke({
    message,
    history,
    userId,
  });

  return result.response;
};
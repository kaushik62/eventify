import Groq from "groq-sdk";
import { query } from "../db/db";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

/**
 * Very simple RAG-lite approach: pull a slice of relevant events straight
 * from PostgreSQL (no vector DB, no LangChain) and hand them to Groq as
 * context so the assistant can answer with real, current data.
 */
const getEventContext = async () => {
  const result = await query(
    `SELECT name, category, location, event_date, price, available_seats
     FROM events
     WHERE event_date >= CURRENT_DATE
     ORDER BY event_date ASC
     LIMIT 40`
  );
  return result.rows;
};

export const chatWithAssistant = async (message: string, history: { role: string; content: string }[] = []) => {
  if (!groq) {
    return "AI assistant is not configured yet. Add your Groq API key to enable recommendations.";
  }

  const events = await getEventContext();

  const systemPrompt = `You are the Eventify AI assistant, helping users discover and book events.
You have access to the following upcoming events (JSON):
${JSON.stringify(events)}

Rules:
- Only recommend events from the list above.
- Be concise and friendly.
- If asked about price, mention the exact price in INR (₹).
- If nothing matches the user's request, say so honestly and suggest browsing all events.
- Never invent events that are not in the list.`;

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user", content: message },
    ],
    temperature: 0.4,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content ?? "Sorry, I couldn't come up with a response.";
};

import { z } from "zod";

// Schema for booking an event
export const createBookingSchema = z.object({
  eventId: z.number().int().positive("Invalid event ID"),
  tickets: z.number().int().positive("Must book at least 1 ticket").max(10, "Max 10 tickets per booking"),
});

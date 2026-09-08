import { z } from "zod";

export const createBookingSchema = z.object({
  eventId: z.number().int().positive(),
  tickets: z.number().int().positive().max(10, "Max 10 tickets per booking"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2),
  location: z.string().min(2),
  eventDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  eventTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM"),
  price: z.number().nonnegative(),
  totalSeats: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const eventQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(["date_asc", "date_desc", "price_asc", "price_desc"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventQueryInput = z.infer<typeof eventQuerySchema>;

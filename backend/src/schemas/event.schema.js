import { z } from "zod";

// Schema for creating an event
export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  location: z.string().min(2, "Location is required"),
  eventDate: z.string().refine((d) => {
    const parsed = Date.parse(d);
    return !isNaN(parsed) && parsed >= Date.now();
  }, "Event date must be today or in the future"),
  eventTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, "Time must be HH:MM format")
    .transform((t) => t.slice(0, 5)),
  price: z.number().nonnegative("Price must be 0 or greater"),
  totalSeats: z.number().int().positive("Seats must be at least 1"),
  imageUrl: z.string().url().optional(),
});

// Schema for updating an event (all fields optional)
export const updateEventSchema = createEventSchema.partial();

// Schema for querying/filtering events
export const eventQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sort: z.enum(["date_asc", "date_desc", "price_asc", "price_desc"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
}).refine(
  (filters) => filters.minPrice === undefined || filters.maxPrice === undefined || filters.minPrice <= filters.maxPrice,
  { message: "Minimum price cannot exceed maximum price" }
);

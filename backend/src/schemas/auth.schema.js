import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z
    .string()
    .optional()
    .transform((val) => (val ? val.toUpperCase() : "USER"))
    .pipe(z.enum(["USER", "ORGANIZER"]))
    .default("USER"),
  organizationName: z.string().optional(),
  bio: z.string().optional(),
});

export const applyOrganizerSchema = z.object({
  organizationName: z.string().trim().min(2, "Organization name must be at least 2 characters").optional(),
  bio: z.string().trim().min(10, "Please provide a short description or experience (minimum 10 characters)").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});


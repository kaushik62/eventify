import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message cannot be empty"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});


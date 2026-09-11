import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { chatWithAssistant } from "../services/ai.service.js";

const chatSchema = z.object({
  message: z.string().min(1, "Message is required"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

export const chat = asyncHandler(async (req, res) => {
  const { message, history } = chatSchema.parse(req.body);
  const reply = await chatWithAssistant(message, history);
  return success(res, { reply });
});

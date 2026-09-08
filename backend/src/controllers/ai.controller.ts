import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { chatWithAssistant } from "../services/ai.service";

const chatSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
});

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const { message, history } = chatSchema.parse(req.body);
  const reply = await chatWithAssistant(message, history);
  return success(res, { reply });
});

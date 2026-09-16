import { asyncHandler } from "../utils/asyncHandler.js";
import { chatRequestSchema } from "../schemas/ai.schema.js";
import { chatWithAgent } from "../services/ai.service.js";

export const chat = asyncHandler(async (req, res) => {
  // Validate request body using Zod schema
  const { message, history } = chatRequestSchema.parse(req.body);

  // Authenticated user ID comes strictly from verified JWT via req.user
  // We NEVER trust a userId passed in req.body
  const userId = req.user?.id || null;

  // Process message through LangGraph agent workflow
  const reply = await chatWithAgent({ message, history, userId });

  // Uniform response compatible with:
  // 1. Direct API callers: res.data.response
  // 2. Existing frontend AIAssistant: res.data.data.reply or res.data.reply
  return res.status(200).json({
    success: true,
    response: reply,
    data: {
      reply,
      response: reply,
    },
  });
});

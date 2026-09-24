import { asyncHandler } from "../utils/asyncHandler.js";
import { chatRequestSchema } from "../schemas/ai.schema.js";
import { chatWithAgent } from "../services/ai.service.js";

export const chat = asyncHandler(async (req, res) => {
  const { message, history } = chatRequestSchema.parse(req.body);
  const userId = req.user?.id || null;

  const reply = await chatWithAgent({ message, history, userId });

  return res.status(200).json({
    success: true,
    response: reply,
    data: {
      reply,
      response: reply,
    },
  });
});


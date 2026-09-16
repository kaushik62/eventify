import { Router } from "express";
import * as aiController from "../controllers/ai.controller.js";
import { extractOptionalUser } from "../middleware/auth.middleware.js";

const router = Router();

// AI assistant chat endpoint with optional JWT authentication
router.post("/chat", extractOptionalUser, aiController.chat);

export default router;


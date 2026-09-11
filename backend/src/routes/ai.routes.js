import { Router } from "express";
import * as aiController from "../controllers/ai.controller.js";

const router = Router();

// AI assistant chat endpoint (available for all visitors & authenticated users)
router.post("/chat", aiController.chat);

export default router;

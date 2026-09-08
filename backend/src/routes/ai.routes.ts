import { Router } from "express";
import * as aiController from "../controllers/ai.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/chat", authenticateUser, aiController.chat);

export default router;

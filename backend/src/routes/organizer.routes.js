import { Router } from "express";
import * as organizerController from "../controllers/organizer.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/apply", authenticateUser, organizerController.apply);
router.get("/me/status", authenticateUser, organizerController.status);

export default router;

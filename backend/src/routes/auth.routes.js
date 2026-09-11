import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticateUser, authController.me);

export default router;

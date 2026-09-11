import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-order", authenticateUser, paymentController.createOrder);
router.post("/verify", authenticateUser, paymentController.verifyPayment);

export default router;

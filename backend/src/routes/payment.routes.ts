import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-order", authenticateUser, paymentController.createOrder);
router.post("/verify", authenticateUser, paymentController.verifyPayment);

export default router;

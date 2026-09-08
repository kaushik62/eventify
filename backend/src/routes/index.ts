import { Router } from "express";
import authRoutes from "./auth.routes";
import eventRoutes from "./event.routes";
import bookingRoutes from "./booking.routes";
import paymentRoutes from "./payment.routes";
import aiRoutes from "./ai.routes";
import uploadRoutes from "./upload.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/ai", aiRoutes);
router.use("/uploads", uploadRoutes);
router.use("/admin", adminRoutes);

export default router;

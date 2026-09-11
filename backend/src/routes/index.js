import { Router } from "express";

import authRoutes from "./auth.routes.js";
import eventRoutes from "./event.routes.js";
import bookingRoutes from "./booking.routes.js";
import paymentRoutes from "./payment.routes.js";
import aiRoutes from "./ai.routes.js";
import uploadRoutes from "./upload.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/ai", aiRoutes);
router.use("/uploads", uploadRoutes);
router.use("/admin", adminRoutes);

export default router;

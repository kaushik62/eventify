import { Router } from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticateUser, bookingController.createBooking);
router.get("/", authenticateUser, bookingController.listMyBookings);
router.get("/:id", authenticateUser, bookingController.getBooking);

export default router;


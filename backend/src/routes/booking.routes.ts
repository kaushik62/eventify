import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticateUser, bookingController.createBooking);
router.get("/", authenticateUser, bookingController.listMyBookings);
router.get("/:id", authenticateUser, bookingController.getBooking);
router.delete("/:id", authenticateUser, bookingController.cancelBooking);

export default router;

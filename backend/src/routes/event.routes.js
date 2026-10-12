import { Router } from "express";
import * as eventController from "../controllers/event.controller.js";
import * as bookingController from "../controllers/booking.controller.js";
import { authenticateUser, requireApprovedOrganizer } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/organizer/my-events",
  authenticateUser,
  requireApprovedOrganizer,
  eventController.myEvents
);

router.get(
  "/organizer/stats",
  authenticateUser,
  requireApprovedOrganizer,
  eventController.organizerStats
);

router.get(
  "/:eventId/bookings",
  authenticateUser,
  requireApprovedOrganizer,
  bookingController.eventBookings
);

router.get("/", eventController.listEvents);
router.get("/:id", eventController.getEvent);

router.post("/", authenticateUser, requireApprovedOrganizer, eventController.createEvent);
router.put("/:id", authenticateUser, requireApprovedOrganizer, eventController.updateEvent);
router.delete(
  "/:id",
  authenticateUser,
  requireApprovedOrganizer,
  eventController.deleteEvent
);

export default router;


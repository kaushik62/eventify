import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import * as bookingController from "../controllers/booking.controller";
import { authenticateUser, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

// Organizer-only routes (declared before /:id so "my-events" isn't parsed as an id)
router.get(
  "/organizer/my-events",
  authenticateUser,
  authorizeRole("ORGANIZER"),
  eventController.myEvents
);
router.get(
  "/organizer/stats",
  authenticateUser,
  authorizeRole("ORGANIZER"),
  eventController.organizerStats
);
router.get(
  "/:eventId/bookings",
  authenticateUser,
  authorizeRole("ORGANIZER"),
  bookingController.eventBookings
);

router.get("/", eventController.listEvents);
router.get("/:id", eventController.getEvent);
router.post("/", authenticateUser, authorizeRole("ORGANIZER"), eventController.createEvent);
router.put("/:id", authenticateUser, authorizeRole("ORGANIZER"), eventController.updateEvent);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole("ORGANIZER", "ADMIN"),
  eventController.deleteEvent
);

export default router;

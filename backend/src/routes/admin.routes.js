import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticateUser, authorizeRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateUser, authorizeRole("ADMIN"));

// Core Platform Stats, Users, Bookings
router.get("/stats", adminController.stats);
router.get("/users", adminController.users);
router.get("/events", adminController.events);
router.get("/bookings", adminController.bookings);
router.delete("/events/:id", adminController.deleteEvent);

// Organizer Management & Decision Workflows
router.get("/organizers", adminController.listOrganizers);
router.get("/organizers/:organizerId", adminController.getOrganizer);
router.patch("/organizers/:organizerId/approve", adminController.approveOrganizer);
router.patch("/organizers/:organizerId/reject", adminController.rejectOrganizer);

// Organizer Events & Specific Analytics
router.get("/organizers/:organizerId/events", adminController.organizerEvents);
router.get("/organizers/:organizerId/analytics", adminController.organizerAnalytics);

// Platform-Wide Analytics
router.get("/analytics/overview", adminController.analyticsOverview);
router.get("/analytics/revenue", adminController.revenueAnalytics);

export default router;

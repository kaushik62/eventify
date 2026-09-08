import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticateUser, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateUser, authorizeRole("ADMIN"));

router.get("/stats", adminController.stats);
router.get("/users", adminController.users);
router.get("/events", adminController.events);
router.get("/bookings", adminController.bookings);
router.delete("/events/:id", adminController.deleteEvent);

export default router;

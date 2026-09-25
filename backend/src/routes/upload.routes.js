import { Router } from "express";
import * as uploadController from "../controllers/upload.controller.js";
import { authenticateUser, authorizeRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/presigned-url",
  authenticateUser,
  authorizeRole("ORGANIZER", "ADMIN"),
  uploadController.getPresignedUrl
);

export default router;


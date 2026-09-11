import { Router } from "express";
import * as uploadController from "../controllers/upload.controller.js";
import { authenticateUser, authorizeRole } from "../middleware/auth.middleware.js";

const router = Router();

// Retrieve uploaded images
router.get("/image/*", uploadController.getImage);

// Direct presigned upload
router.post(
  "/presigned-url",
  authenticateUser,
  authorizeRole("ORGANIZER", "ADMIN"),
  uploadController.getPresignedUrl
);

// S3 upload endpoint
router.post(
  "/image",
  authenticateUser,
  authorizeRole("ORGANIZER", "ADMIN"),
  ...uploadController.uploadImage
);

export default router;

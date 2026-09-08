import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";
import { authenticateUser, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/image/*", uploadController.getImage);

router.post(
  "/presigned-url",
  authenticateUser,
  authorizeRole("ORGANIZER", "ADMIN"),
  uploadController.getPresignedUrl
);

router.post(
  "/image",
  authenticateUser,
  authorizeRole("ORGANIZER", "ADMIN"),
  ...uploadController.uploadImage
);

export default router;

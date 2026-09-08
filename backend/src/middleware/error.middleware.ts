import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiResponse";
import { ZodError } from "zod";
import multer from "multer";

// Centralized error handler — every thrown error in the app ends up here
// via asyncHandler, so controllers never need their own try/catch blocks.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err instanceof Error && err.message === "Only image uploads are allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Internal server error" });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiResponse";
import { ZodError } from "zod";
import multer from "multer";

// Centralized error handler — handles all errors in one place
// formats clear error messages explaining why the error occurred
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Zod validation error — construct clear error message with field names & details
  if (err instanceof ZodError) {
    const formattedIssues = err.issues.map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    });

    const message = formattedIssues.length > 0
      ? formattedIssues.join("; ")
      : "Validation failed";

    return res.status(400).json({
      success: false,
      message,
      errors: err.flatten().fieldErrors,
      details: err.issues,
    });
  }

  // Custom API error
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Multer file upload error
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // File type validation error
  if (err instanceof Error && err.message === "Only image uploads are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Standard or runtime Error — log details and send message explaining why error happened
  console.error("Unhandled Error:", err);

  const message = err instanceof Error && err.message
    ? err.message
    : "Internal server error";

  return res.status(500).json({
    success: false,
    message,
  });
};

// Handle routes that do not exist
export const notFoundHandler = (_req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

import { ZodError } from "zod";
import multer from "multer";
import { ApiError } from "../utils/apiResponse.js";

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const formattedIssues = err.issues.map((issue) => {
      const field = issue.path.join(".");
      return field ? `${field}: ${issue.message}` : issue.message;
    });

    return res.status(400).json({
      success: false,
      message: formattedIssues.join("; ") || "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  if (err instanceof Error && err.message === "Only image uploads are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  console.error("Unhandled Error:", err);
  const message = err instanceof Error ? err.message : "Internal server error";

  return res.status(500).json({
    success: false,
    message,
  });
};

export const notFoundHandler = (_req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};


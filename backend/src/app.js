import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/health", (_req, res) => res.json({ success: true, status: "ok" }));

// API routes
app.use("/api", routes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

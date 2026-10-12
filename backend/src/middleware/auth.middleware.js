import jwt from "jsonwebtoken";
import { query } from "../db/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

export const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export const authenticateUser = (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login.",
    });
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  req.user = user;
  next();
};

export const authorizeRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: "Permission denied.",
    });
  }

  next();
};

export const requireApprovedOrganizer = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login.",
    });
  }

  // Admins are granted full management access
  if (req.user.role === "ADMIN") {
    return next();
  }

  if (req.user.role !== "ORGANIZER") {
    return res.status(403).json({
      success: false,
      message: "Organizer access required.",
    });
  }

  try {
    // Recheck the latest approval status directly from PostgreSQL database
    const { rows } = await query(
      "SELECT id, role, organizer_status FROM users WHERE id = $1",
      [req.user.id]
    );

    const dbUser = rows[0];
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (dbUser.role !== "ORGANIZER" || dbUser.organizer_status !== "APPROVED") {
      const reason =
        dbUser.organizer_status === "PENDING"
          ? "Your organizer application is currently under review by administrators."
          : dbUser.organizer_status === "REJECTED"
          ? "Your organizer application has been rejected by an administrator."
          : "Verified organizer approval required.";

      return res.status(403).json({
        success: false,
        message: reason,
        organizer_status: dbUser.organizer_status,
      });
    }

    req.user.organizer_status = dbUser.organizer_status;
    next();
  } catch (error) {
    return next(error);
  }
};

export const extractOptionalUser = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.token || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
};
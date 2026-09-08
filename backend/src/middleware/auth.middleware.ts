import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { failure } from "../utils/apiResponse";

// Extend Express's Request type so `req.user` is typed everywhere downstream.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Reads the JWT from the Authorization header (Bearer <token>) or the
 * `token` cookie, verifies it, and attaches the decoded payload to req.user.
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;
  const token = bearerToken || req.cookies?.token;

  if (!token) {
    return failure(res, "Authentication required", 401);
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return failure(res, "Invalid or expired token", 401);
  }
};

/**
 * Restricts a route to one or more roles. Must run after authenticateUser.
 * Usage: authorizeRole("ORGANIZER", "ADMIN")
 */
export const authorizeRole =
  (...roles: Array<"USER" | "ORGANIZER" | "ADMIN">) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return failure(res, "You do not have permission to perform this action", 403);
    }
    next();
  };

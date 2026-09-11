import { verifyToken } from "../utils/jwt.js";
import { failure } from "../utils/apiResponse.js";

// Authenticate user from cookie or Authorization header
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.token || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

  if (!token) {
    return failure(res, "Authentication required. Please login.", 401);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return failure(res, "Invalid or expired token. Please login again.", 401);
  }

  req.user = payload;
  next();
};

// Authorize specific user roles (e.g. 'ADMIN', 'ORGANIZER')
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return failure(res, "Forbidden: You do not have permission to perform this action.", 403);
    }
    next();
  };
};

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Generate a JWT token
export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify a JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

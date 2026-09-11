import bcrypt from "bcrypt";
import { query } from "../db/db.js";
import { signToken } from "../utils/jwt.js";
import { ApiError } from "../utils/apiResponse.js";

const SALT_ROUNDS = 10;

// Register a new user
export const registerUser = async (input) => {
  const existing = await query("SELECT id FROM users WHERE email = $1", [input.email]);
  if (existing.rows.length > 0) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const result = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [input.name, input.email, hashedPassword, input.role]
  );

  const user = result.rows[0];
  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

// Login an existing user
export const loginUser = async (input) => {
  const result = await query(
    "SELECT id, name, email, password, role FROM users WHERE email = $1",
    [input.email]
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ id: user.id, role: user.role });
  delete user.password;
  return { user, token };
};

// Get user by ID
export const getUserById = async (id) => {
  const result = await query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) {
    throw new ApiError(404, "User not found");
  }
  return result.rows[0];
};

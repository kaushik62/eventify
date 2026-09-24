import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { registerUser, loginUser, getUserById } from "../services/auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const { user, token } = await registerUser(input);
  res.cookie("token", token, COOKIE_OPTIONS);
  return success(res, { user, token }, 201);
});

export const login = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const { user, token } = await loginUser(input);
  res.cookie("token", token, COOKIE_OPTIONS);
  return success(res, { user, token });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  return success(res, { message: "Logged out successfully" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);
  return success(res, { user });
});


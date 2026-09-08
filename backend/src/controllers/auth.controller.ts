import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { registerUser, loginUser, getUserById } from "../services/auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const { user, token } = await registerUser(input);
  res.cookie("token", token, COOKIE_OPTIONS);
  return success(res, { user, token }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const { user, token } = await loginUser(input);
  res.cookie("token", token, COOKIE_OPTIONS);
  return success(res, { user, token });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token");
  return success(res, { message: "Logged out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.id);
  return success(res, user);
});

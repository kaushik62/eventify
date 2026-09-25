import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const { user, token } = await registerUser(input);

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const { user, token } = await loginUser(input);

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const me = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
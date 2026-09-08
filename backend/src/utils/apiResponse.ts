import { Response } from "express";

// Every API response follows the same shape so the frontend
// can handle success/error generically.
export const success = (res: Response, data: unknown, status = 200) => {
  return res.status(status).json({ success: true, data });
};

export const failure = (res: Response, message: string, status = 400) => {
  return res.status(status).json({ success: false, message });
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

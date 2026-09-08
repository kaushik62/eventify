import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import * as adminService from "../services/admin.service";

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminService.getPlatformStats();
  return success(res, data);
});

export const users = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const data = await adminService.listAllUsers(page);
  return success(res, data);
});

export const events = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const data = await adminService.listAllEvents(page);
  return success(res, data);
});

export const bookings = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const data = await adminService.listAllBookings(page);
  return success(res, data);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await adminService.adminDeleteEvent(Number(req.params.id));
  return success(res, { message: "Event deleted" });
});

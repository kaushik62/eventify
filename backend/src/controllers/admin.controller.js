import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import * as adminService from "../services/admin.service.js";

export const stats = asyncHandler(async (_req, res) => {
  const data = await adminService.getPlatformStats();
  return success(res, data);
});

export const users = asyncHandler(async (_req, res) => {
  const data = await adminService.listAllUsers();
  return success(res, data);
});

export const events = asyncHandler(async (_req, res) => {
  const data = await adminService.listAllEvents();
  return success(res, data);
});

export const bookings = asyncHandler(async (_req, res) => {
  const data = await adminService.listAllBookings();
  return success(res, data);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const eventId = Number(req.params.id);
  const data = await adminService.adminDeleteEvent(eventId);
  return success(res, { message: "Event deleted successfully", data });
});

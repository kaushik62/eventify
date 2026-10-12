import { asyncHandler } from "../utils/asyncHandler.js";
import { success, ApiError } from "../utils/apiResponse.js";
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

export const listOrganizers = asyncHandler(async (req, res) => {
  const { status, search, page, limit } = req.query;
  const data = await adminService.listOrganizers({
    status: status ? String(status) : "ALL",
    search: search ? String(search) : "",
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });
  return success(res, data);
});

export const getOrganizer = asyncHandler(async (req, res) => {
  const organizerId = Number(req.params.organizerId);
  if (isNaN(organizerId)) {
    throw new ApiError(400, "Invalid organizer ID");
  }
  const data = await adminService.getOrganizerDetails(organizerId);
  return success(res, data);
});

export const approveOrganizer = asyncHandler(async (req, res) => {
  const organizerId = Number(req.params.organizerId);
  if (isNaN(organizerId)) {
    throw new ApiError(400, "Invalid organizer ID");
  }
  const organizer = await adminService.approveOrganizer(organizerId, req.user.id);
  return success(res, {
    message: "Organizer has been approved successfully.",
    organizer,
  });
});

export const rejectOrganizer = asyncHandler(async (req, res) => {
  const organizerId = Number(req.params.organizerId);
  if (isNaN(organizerId)) {
    throw new ApiError(400, "Invalid organizer ID");
  }
  const reason = req.body?.reason || "Application did not meet requirements.";
  const organizer = await adminService.rejectOrganizer(organizerId, req.user.id, reason);
  return success(res, {
    message: "Organizer application has been rejected.",
    organizer,
  });
});

export const organizerEvents = asyncHandler(async (req, res) => {
  const organizerId = Number(req.params.organizerId);
  if (isNaN(organizerId)) {
    throw new ApiError(400, "Invalid organizer ID");
  }
  const data = await adminService.listOrganizerEvents(organizerId);
  return success(res, data);
});

export const organizerAnalytics = asyncHandler(async (req, res) => {
  const organizerId = Number(req.params.organizerId);
  if (isNaN(organizerId)) {
    throw new ApiError(400, "Invalid organizer ID");
  }
  const data = await adminService.getOrganizerAnalytics(organizerId);
  return success(res, data);
});

export const analyticsOverview = asyncHandler(async (_req, res) => {
  const data = await adminService.getPlatformStats();
  return success(res, data);
});

export const revenueAnalytics = asyncHandler(async (_req, res) => {
  const data = await adminService.getPlatformRevenueAnalytics();
  return success(res, data);
});

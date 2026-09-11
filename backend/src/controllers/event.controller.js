import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import {
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
} from "../schemas/event.schema.js";
import * as eventService from "../services/event.service.js";

export const listEvents = asyncHandler(async (req, res) => {
  const filters = eventQuerySchema.parse(req.query);
  const result = await eventService.listEvents(filters);
  return success(res, result);
});

export const getEvent = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const event = await eventService.getEventById(id);
  const related = await eventService.getRelatedEvents(event.category, id);
  return success(res, { ...event, related });
});

export const createEvent = asyncHandler(async (req, res) => {
  const input = createEventSchema.parse(req.body);
  const event = await eventService.createEvent(req.user.id, input);
  return success(res, event, 201);
});

export const updateEvent = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const input = updateEventSchema.parse(req.body);
  const event = await eventService.updateEvent(id, req.user.id, input);
  return success(res, event);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const isAdmin = req.user.role === "ADMIN";
  await eventService.deleteEvent(id, req.user.id, isAdmin);
  return success(res, { message: "Event deleted successfully" });
});

export const myEvents = asyncHandler(async (req, res) => {
  const events = await eventService.listEventsByOrganizer(req.user.id);
  return success(res, events);
});

export const organizerStats = asyncHandler(async (req, res) => {
  const stats = await eventService.getOrganizerStats(req.user.id);
  return success(res, stats);
});

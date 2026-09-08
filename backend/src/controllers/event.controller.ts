import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import {
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
} from "../schemas/event.schema";
import * as eventService from "../services/event.service";

export const listEvents = asyncHandler(async (req: Request, res: Response) => {
  const filters = eventQuerySchema.parse(req.query);
  const result = await eventService.listEvents(filters);
  return success(res, result);
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.getEventById(Number(req.params.id));
  const related = await eventService.getRelatedEvents(event.category, event.id);
  return success(res, { event, related });
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const input = createEventSchema.parse(req.body);
  const event = await eventService.createEvent(req.user!.id, input);
  return success(res, event, 201);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const input = updateEventSchema.parse(req.body);
  const event = await eventService.updateEvent(Number(req.params.id), req.user!.id, input);
  return success(res, event);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await eventService.deleteEvent(Number(req.params.id), req.user!.id);
  return success(res, { message: "Event deleted" });
});

export const myEvents = asyncHandler(async (req: Request, res: Response) => {
  const events = await eventService.listEventsByOrganizer(req.user!.id);
  return success(res, events);
});

export const organizerStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await eventService.getOrganizerStats(req.user!.id);
  return success(res, stats);
});

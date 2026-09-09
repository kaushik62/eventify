import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { createBookingSchema } from "../schemas/booking.schema";
import * as bookingService from "../services/booking.service";

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const input = createBookingSchema.parse(req.body);
  const booking = await bookingService.createBooking(req.user!.id, input);
  return success(res, booking, 201);
});

export const listMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getBookingsByUser(req.user!.id);
  return success(res, bookings);
});

export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingById(Number(req.params.id), req.user!.id);
  return success(res, booking);
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(Number(req.params.id), req.user!.id);
  return success(res, booking);
});

export const eventBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getBookingsForOrganizerEvent(
    Number(req.params.eventId),
    req.user!.id
  );
  return success(res, bookings);
});

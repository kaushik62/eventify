import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { createBookingSchema } from "../schemas/booking.schema.js";
import * as bookingService from "../services/booking.service.js";

export const createBooking = asyncHandler(async (req, res) => {
  const input = createBookingSchema.parse(req.body);
  const booking = await bookingService.createBooking(req.user.id, input);
  return success(res, booking, 201);
});

export const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getBookingsByUser(req.user.id);
  return success(res, bookings);
});

export const getBooking = asyncHandler(async (req, res) => {
  const bookingId = Number(req.params.id);
  const booking = await bookingService.getBookingById(bookingId, req.user.id);
  return success(res, booking);
});

export const eventBookings = asyncHandler(async (req, res) => {
  const eventId = Number(req.params.eventId);
  const bookings = await bookingService.getBookingsForOrganizerEvent(eventId, req.user.id);
  return success(res, bookings);
});


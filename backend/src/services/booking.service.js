import { query, withTransaction } from "../db/db.js";
import { ApiError } from "../utils/apiResponse.js";

import { sendBookingConfirmation } from "./send_email.js";

export const createBooking = async (userId, input) => {
  return withTransaction(async (client) => {
    const eventResult = await client.query(
      "SELECT id, organizer_id, price, available_seats, event_date, event_time FROM events WHERE id = $1 FOR UPDATE",
      [input.eventId]
    );

    if (eventResult.rows.length === 0) {
      throw new ApiError(404, "Event not found");
    }

    const event = eventResult.rows[0];

    const eventStart = new Date(`${event.event_date.toISOString().slice(0, 10)}T${event.event_time}`);
    if (eventStart <= new Date()) {
      throw new ApiError(400, "This event has already started or ended");
    }

    if (event.organizer_id === userId) {
      throw new ApiError(403, "Organizers cannot book their own events");
    }

    if (event.available_seats < input.tickets) {
      throw new ApiError(400, "Not enough seats available");
    }

    const totalAmount = Number(event.price) * input.tickets;

    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, event_id, tickets, total_amount, status)
       VALUES ($1, $2, $3, $4, 'PENDING')
       RETURNING *`,
      [userId, input.eventId, input.tickets, totalAmount]
    );

    await client.query(
      "UPDATE events SET available_seats = available_seats - $1 WHERE id = $2",
      [input.tickets, input.eventId]
    );

    return bookingResult.rows[0];
  });
};

export const confirmBooking = async (bookingId) => {
  const result = await query(
    `UPDATE bookings
     SET status = 'CONFIRMED'
     WHERE id = $1 AND status = 'PENDING'
     RETURNING *`,
    [bookingId]
  );

  // If the booking was already confirmed, don't send another email.
  if (result.rows.length === 0) {
    const existing = await query(
      "SELECT * FROM bookings WHERE id = $1",
      [bookingId]
    );

    if (existing.rows[0]?.status === "CONFIRMED") {
      return existing.rows[0];
    }

    throw new ApiError(
      409,
      "This booking is no longer awaiting payment"
    );
  }

  const booking = result.rows[0];

  // Get user and event details for the confirmation email.
  const detailsResult = await query(
    `SELECT
       u.name AS user_name,
       u.email AS user_email,
       e.name AS event_name,
       e.event_date,
       e.event_time,
       e.location
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN events e ON e.id = b.event_id
     WHERE b.id = $1`,
    [bookingId]
  );

  const details = detailsResult.rows[0];

  // Send the email without affecting booking confirmation.
  try {
    await sendBookingConfirmation({
      email: details.user_email,
      name: details.user_name,
      eventName: details.event_name,
      bookingId: booking.id,
      date: details.event_date,
      time: details.event_time,
      location: details.location,
      seats: booking.tickets,
      amount: booking.total_amount,
    });
  } catch (error) {
    console.error("Booking confirmation email failed:", error);
  }

  return booking;
};

export const failBooking = async (bookingId) => {
  return withTransaction(async (client) => {
    const bookingResult = await client.query(
      "SELECT event_id, tickets, status FROM bookings WHERE id = $1 FOR UPDATE",
      [bookingId]
    );
    const booking = bookingResult.rows[0];
    if (!booking) return;

    if (booking.status !== "PENDING") return booking;

    await client.query("UPDATE bookings SET status = 'FAILED' WHERE id = $1 AND status = 'PENDING'", [bookingId]);
    await client.query(
      "UPDATE events SET available_seats = available_seats + $1 WHERE id = $2",
      [booking.tickets, booking.event_id]
    );
  });
};

export const getBookingsByUser = async (userId) => {
  const result = await query(
    `SELECT b.*, e.name AS event_name, e.event_date, e.event_time, e.location, e.image_url
     FROM bookings b
     JOIN events e ON e.id = b.event_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getBookingById = async (bookingId, userId) => {
  const ownershipClause = userId === undefined ? "" : " AND b.user_id = $2";
  const result = await query(
    `SELECT b.*, e.name AS event_name, e.event_date, e.event_time, e.location,
            e.image_url, e.organizer_id
     FROM bookings b
     JOIN events e ON e.id = b.event_id
     WHERE b.id = $1${ownershipClause}`,
    userId === undefined ? [bookingId] : [bookingId, userId]
  );
  if (result.rows.length === 0) throw new ApiError(404, "Booking not found");
  return result.rows[0];
};

export const getBookingsForOrganizerEvent = async (eventId, organizerId) => {
  const eventCheck = await query("SELECT organizer_id FROM events WHERE id = $1", [eventId]);
  if (eventCheck.rows.length === 0) throw new ApiError(404, "Event not found");
  if (eventCheck.rows[0].organizer_id !== organizerId) {
    throw new ApiError(403, "You can only view bookings for your own events");
  }

  const result = await query(
    `SELECT b.*, u.name AS user_name, u.email AS user_email
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     WHERE b.event_id = $1
     ORDER BY b.created_at DESC`,
    [eventId]
  );
  return result.rows;
};


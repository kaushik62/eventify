import { query } from "../db/db.js";

export const getPlatformStats = async () => {
  const [users, organizers, events, bookings, revenue] = await Promise.all([
    query("SELECT COUNT(*) FROM users WHERE role = 'USER'"),
    query("SELECT COUNT(*) FROM users WHERE role = 'ORGANIZER'"),
    query("SELECT COUNT(*) FROM events"),
    query("SELECT COUNT(*) FROM bookings WHERE status = 'CONFIRMED'"),
    query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM bookings WHERE status = 'CONFIRMED'"),
  ]);

  return {
    totalUsers: Number(users.rows[0].count),
    totalOrganizers: Number(organizers.rows[0].count),
    totalEvents: Number(events.rows[0].count),
    totalBookings: Number(bookings.rows[0].count),
    totalRevenue: Number(revenue.rows[0].total),
  };
};

export const listAllUsers = async () => {
  const result = await query(
    `SELECT id, name, email, role, created_at,
            (SELECT COUNT(*) FROM bookings b WHERE b.user_id = users.id) AS total_bookings
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
};

export const listAllEvents = async () => {
  const result = await query(
    `SELECT e.*, u.name AS organizer_name,
            (SELECT COUNT(*) FROM bookings b WHERE b.event_id = e.id AND b.status = 'CONFIRMED') AS confirmed_bookings
     FROM events e
     JOIN users u ON u.id = e.organizer_id
     ORDER BY e.created_at DESC`
  );
  return result.rows;
};

export const listAllBookings = async () => {
  const result = await query(
    `SELECT b.*, u.name AS user_name, u.email AS user_email, e.name AS event_name, e.location, e.event_date
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN events e ON e.id = b.event_id
     ORDER BY b.created_at DESC`
  );
  return result.rows;
};

export const adminDeleteEvent = async (eventId) => {
  const result = await query("DELETE FROM events WHERE id = $1 RETURNING id", [eventId]);
  return result.rows[0];
};


import { query } from "../db/db";

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

export const listAllUsers = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const result = await query(
    `SELECT id, name, email, role, created_at FROM users
     ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const listAllEvents = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const result = await query(
    `SELECT e.*, u.name AS organizer_name FROM events e
     JOIN users u ON u.id = e.organizer_id
     ORDER BY e.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const listAllBookings = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const result = await query(
    `SELECT b.*, u.name AS user_name, e.name AS event_name FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN events e ON e.id = b.event_id
     ORDER BY b.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const adminDeleteEvent = async (eventId: number) => {
  await query("DELETE FROM events WHERE id = $1", [eventId]);
};

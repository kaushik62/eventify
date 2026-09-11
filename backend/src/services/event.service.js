import { query } from "../db/db.js";
import { ApiError } from "../utils/apiResponse.js";

// Helper to map camelCase field names to database snake_case columns
const columnToDbName = (column) => {
  const map = {
    name: "name",
    description: "description",
    category: "category",
    location: "location",
    eventDate: "event_date",
    eventTime: "event_time",
    price: "price",
    totalSeats: "total_seats",
    imageUrl: "image_url",
  };
  return map[column] ?? column;
};

// Check if an event belongs to an organizer
const assertOwnership = async (eventId, organizerId) => {
  const result = await query("SELECT organizer_id FROM events WHERE id = $1", [eventId]);
  if (result.rows.length === 0) throw new ApiError(404, "Event not found");
  if (result.rows[0].organizer_id !== organizerId) {
    throw new ApiError(403, "You can only manage your own events");
  }
};

// List public events with search, category, location, date, price, and sorting filters
export const listEvents = async (filters) => {
  const conditions = [];
  const values = [];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }
  if (filters.category) {
    values.push(filters.category);
    conditions.push(`category = $${values.length}`);
  }
  if (filters.location) {
    values.push(`%${filters.location}%`);
    conditions.push(`location ILIKE $${values.length}`);
  }
  if (filters.date) {
    values.push(filters.date);
    conditions.push(`event_date = $${values.length}`);
  }
  if (filters.minPrice !== undefined) {
    values.push(filters.minPrice);
    conditions.push(`price >= $${values.length}`);
  }
  if (filters.maxPrice !== undefined) {
    values.push(filters.maxPrice);
    conditions.push(`price <= $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const sortMap = {
    date_asc: "event_date ASC",
    date_desc: "event_date DESC",
    price_asc: "price ASC",
    price_desc: "price DESC",
  };
  const orderBy = sortMap[filters.sort ?? ""] ?? "event_date ASC";

  const offset = (filters.page - 1) * filters.limit;
  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;

  const rows = await query(
    `SELECT e.*, u.name AS organizer_name
     FROM events e
     JOIN users u ON u.id = e.organizer_id
     ${whereClause}
     ORDER BY ${orderBy}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    [...values, filters.limit, offset]
  );

  const countResult = await query(`SELECT COUNT(*) FROM events e ${whereClause}`, values);

  return {
    events: rows.rows,
    total: Number(countResult.rows[0].count),
    page: filters.page,
    limit: filters.limit,
  };
};

// Get single event by ID
export const getEventById = async (id) => {
  const result = await query(
    `SELECT e.*, u.name AS organizer_name
     FROM events e
     JOIN users u ON u.id = e.organizer_id
     WHERE e.id = $1`,
    [id]
  );
  if (result.rows.length === 0) {
    throw new ApiError(404, "Event not found");
  }
  return result.rows[0];
};

// Create a new event
export const createEvent = async (organizerId, input) => {
  const fallbackImage = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200";

  const result = await query(
    `INSERT INTO events
       (organizer_id, name, description, category, location, event_date, event_time,
        price, total_seats, available_seats, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10)
     RETURNING *`,
    [
      organizerId,
      input.name,
      input.description,
      input.category,
      input.location,
      input.eventDate,
      input.eventTime,
      input.price,
      input.totalSeats,
      input.imageUrl || fallbackImage,
    ]
  );
  return result.rows[0];
};

// Update an existing event
export const updateEvent = async (eventId, organizerId, input) => {
  await assertOwnership(eventId, organizerId);

  if (input.totalSeats !== undefined) {
    const soldResult = await query(
      `SELECT COALESCE(SUM(tickets), 0) AS held_seats
       FROM bookings WHERE event_id = $1 AND status IN ('PENDING', 'CONFIRMED')`,
      [eventId]
    );
    const heldSeats = Number(soldResult.rows[0].held_seats);
    if (input.totalSeats < heldSeats) {
      throw new ApiError(400, `Total seats cannot be lower than ${heldSeats} already reserved seats`);
    }
  }

  const fields = [];
  const values = [];
  const fieldKeys = ["name", "description", "category", "location", "eventDate", "eventTime", "price", "totalSeats", "imageUrl"];

  for (const key of fieldKeys) {
    const value = input[key];
    if (value !== undefined) {
      values.push(value);
      fields.push(`${columnToDbName(key)} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    return getEventById(eventId);
  }

  if (input.totalSeats !== undefined) {
    const current = await query("SELECT total_seats, available_seats FROM events WHERE id = $1", [eventId]);
    const reserved = Number(current.rows[0].total_seats) - Number(current.rows[0].available_seats);
    values.push(input.totalSeats - reserved);
    fields.push(`available_seats = $${values.length}`);
  }

  values.push(eventId);
  const result = await query(
    `UPDATE events SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0];
};

// Delete an event
export const deleteEvent = async (eventId, organizerId, isAdmin = false) => {
  if (!isAdmin) {
    await assertOwnership(eventId, organizerId);
  }
  await query("DELETE FROM events WHERE id = $1", [eventId]);
};

// List events created by a specific organizer
export const listEventsByOrganizer = async (organizerId) => {
  const result = await query(
    "SELECT * FROM events WHERE organizer_id = $1 ORDER BY event_date ASC",
    [organizerId]
  );
  return result.rows;
};

// Get stats for organizer dashboard
export const getOrganizerStats = async (organizerId) => {
  const result = await query(
    `SELECT
       COUNT(DISTINCT e.id) AS total_events,
       COALESCE(COUNT(b.id) FILTER (WHERE b.status = 'CONFIRMED'), 0) AS total_bookings,
       COALESCE(SUM(b.tickets) FILTER (WHERE b.status = 'CONFIRMED'), 0) AS tickets_sold,
       COALESCE(SUM(b.total_amount) FILTER (WHERE b.status = 'CONFIRMED'), 0) AS revenue
     FROM events e
     LEFT JOIN bookings b ON b.event_id = e.id
     WHERE e.organizer_id = $1`,
    [organizerId]
  );
  return result.rows[0];
};

// Get related events by category
export const getRelatedEvents = async (category, excludeId) => {
  const result = await query(
    `SELECT * FROM events WHERE category = $1 AND id != $2 ORDER BY event_date ASC LIMIT 4`,
    [category, excludeId]
  );
  return result.rows;
};

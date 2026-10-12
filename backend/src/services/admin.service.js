import { query } from "../db/db.js";
import { ApiError } from "../utils/apiResponse.js";

export const getPlatformStats = async () => {
  const [users, organizers, approved, pending, events, bookings, revenue, refunds] = await Promise.all([
    query("SELECT COUNT(*) FROM users WHERE role = 'USER'"),
    query("SELECT COUNT(*) FROM users WHERE role = 'ORGANIZER'"),
    query("SELECT COUNT(*) FROM users WHERE role = 'ORGANIZER' AND organizer_status = 'APPROVED'"),
    query("SELECT COUNT(*) FROM users WHERE organizer_status = 'PENDING'"),
    query("SELECT COUNT(*) FROM events"),
    query("SELECT COUNT(*) FROM bookings WHERE status = 'CONFIRMED'"),
    query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM bookings WHERE status = 'CONFIRMED'"),
    query("SELECT COALESCE(SUM(amount), 0) AS total FROM refunds WHERE status = 'PROCESSED'"),
  ]);

  const grossRevenue = Number(revenue.rows[0].total);
  const totalRefunds = Number(refunds.rows[0].total);

  return {
    totalUsers: Number(users.rows[0].count),
    totalOrganizers: Number(organizers.rows[0].count),
    totalApprovedOrganizers: Number(approved.rows[0].count),
    pendingOrganizerApplications: Number(pending.rows[0].count),
    totalEvents: Number(events.rows[0].count),
    totalBookings: Number(bookings.rows[0].count),
    totalRevenue: grossRevenue,
    grossRevenue,
    totalRefunds,
    netRevenue: Math.max(0, grossRevenue - totalRefunds),
  };
};

export const listAllUsers = async () => {
  const result = await query(
    `SELECT id, name, email, role, organizer_status, created_at,
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

/**
 * List organizers with filtering by status and search term, with pagination and financial aggregations
 */
export const listOrganizers = async ({
  status = "ALL",
  search = "",
  page = 1,
  limit = 10,
}) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
  const offset = (pageNum - 1) * limitNum;

  const whereConditions = ["(u.role = 'ORGANIZER' OR u.organizer_status IS NOT NULL)"];
  const params = [];

  if (status && status !== "ALL") {
    params.push(status.toUpperCase());
    whereConditions.push(`u.organizer_status = $${params.length}`);
  }

  if (search && search.trim()) {
    params.push(`%${search.trim().toLowerCase()}%`);
    whereConditions.push(
      `(LOWER(u.name) LIKE $${params.length} OR LOWER(u.email) LIKE $${params.length} OR LOWER(COALESCE(u.organization_name, '')) LIKE $${params.length})`
    );
  }

  const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

  // Total count query
  const countRes = await query(
    `SELECT COUNT(*) FROM users u ${whereClause}`,
    params
  );
  const total = Number(countRes.rows[0].count);

  // Paginated data query with aggregations
  const queryParams = [...params, limitNum, offset];
  const limitIndex = params.length + 1;
  const offsetIndex = params.length + 2;

  const dataRes = await query(
    `SELECT u.id, u.name, u.email, u.role, u.organizer_status,
            u.organizer_applied_at, u.organizer_decided_at, u.organizer_rejection_reason,
            u.organization_name, u.organizer_bio, u.created_at,
            (SELECT a.name FROM users a WHERE a.id = u.organizer_decided_by) AS decided_by_name,
            (SELECT a.email FROM users a WHERE a.id = u.organizer_decided_by) AS decided_by_email,
            (SELECT COUNT(*) FROM events e WHERE e.organizer_id = u.id)::int AS total_events,
            (SELECT COUNT(b.id) FROM bookings b JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND b.status = 'CONFIRMED')::int AS total_bookings,
            (SELECT COALESCE(SUM(b.tickets), 0) FROM bookings b JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND b.status = 'CONFIRMED')::int AS tickets_sold,
            (SELECT COALESCE(SUM(b.total_amount), 0) FROM bookings b JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND b.status = 'CONFIRMED')::numeric AS gross_revenue,
            (SELECT COALESCE(SUM(r.amount), 0) FROM refunds r JOIN bookings b ON b.id = r.booking_id JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND r.status = 'PROCESSED')::numeric AS total_refunds
     FROM users u
     ${whereClause}
     ORDER BY 
       CASE 
         WHEN u.organizer_status = 'PENDING' THEN 1 
         WHEN u.organizer_status = 'APPROVED' THEN 2 
         ELSE 3 
       END ASC,
       COALESCE(u.organizer_applied_at, u.created_at) DESC
     LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
    queryParams
  );

  const organizers = dataRes.rows.map((row) => {
    const gross = Number(row.gross_revenue || 0);
    const refunds = Number(row.total_refunds || 0);
    return {
      ...row,
      gross_revenue: gross,
      total_refunds: refunds,
      net_revenue: Math.max(0, gross - refunds),
    };
  });

  return {
    organizers,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * Get detailed profile, approval audit, and aggregate financials for a single organizer
 */
export const getOrganizerDetails = async (organizerId) => {
  const result = await query(
    `SELECT u.id, u.name, u.email, u.role, u.organizer_status,
            u.organizer_applied_at, u.organizer_decided_at, u.organizer_rejection_reason,
            u.organization_name, u.organizer_bio, u.created_at,
            a.name AS decided_by_name, a.email AS decided_by_email,
            (SELECT COUNT(*) FROM events e WHERE e.organizer_id = u.id)::int AS total_events,
            (SELECT COUNT(b.id) FROM bookings b JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND b.status = 'CONFIRMED')::int AS total_bookings,
            (SELECT COALESCE(SUM(b.tickets), 0) FROM bookings b JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND b.status = 'CONFIRMED')::int AS tickets_sold,
            (SELECT COALESCE(SUM(b.total_amount), 0) FROM bookings b JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND b.status = 'CONFIRMED')::numeric AS gross_revenue,
            (SELECT COALESCE(SUM(r.amount), 0) FROM refunds r JOIN bookings b ON b.id = r.booking_id JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND r.status = 'PROCESSED')::numeric AS total_refunds
     FROM users u
     LEFT JOIN users a ON a.id = u.organizer_decided_by
     WHERE u.id = $1`,
    [organizerId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "Organizer not found");
  }

  const row = result.rows[0];
  const gross = Number(row.gross_revenue || 0);
  const refunds = Number(row.total_refunds || 0);

  return {
    ...row,
    gross_revenue: gross,
    total_refunds: refunds,
    net_revenue: Math.max(0, gross - refunds),
  };
};

/**
 * Approve an organizer application
 */
export const approveOrganizer = async (organizerId, adminId) => {
  const userCheck = await query("SELECT id, role, organizer_status FROM users WHERE id = $1", [
    organizerId,
  ]);
  if (userCheck.rows.length === 0) {
    throw new ApiError(404, "Organizer account not found");
  }

  const result = await query(
    `UPDATE users
     SET organizer_status = 'APPROVED',
         role = 'ORGANIZER',
         organizer_decided_at = NOW(),
         organizer_decided_by = $2,
         organizer_rejection_reason = NULL
     WHERE id = $1
     RETURNING id, name, email, role, organizer_status, organizer_applied_at, organizer_decided_at, organizer_decided_by, organization_name, organizer_bio, created_at`,
    [organizerId, adminId]
  );

  return result.rows[0];
};

/**
 * Reject an organizer application with recorded reason and admin ID
 */
export const rejectOrganizer = async (organizerId, adminId, reason = "") => {
  const userCheck = await query("SELECT id, role, organizer_status FROM users WHERE id = $1", [
    organizerId,
  ]);
  if (userCheck.rows.length === 0) {
    throw new ApiError(404, "Organizer account not found");
  }

  const result = await query(
    `UPDATE users
     SET organizer_status = 'REJECTED',
         organizer_decided_at = NOW(),
         organizer_decided_by = $2,
         organizer_rejection_reason = $3
     WHERE id = $1
     RETURNING id, name, email, role, organizer_status, organizer_applied_at, organizer_decided_at, organizer_decided_by, organizer_rejection_reason, organization_name, organizer_bio, created_at`,
    [organizerId, adminId, reason || "Application did not meet organizer criteria."]
  );

  return result.rows[0];
};

/**
 * List all events for a specific organizer with booking and revenue metrics
 */
export const listOrganizerEvents = async (organizerId) => {
  const organizerCheck = await query("SELECT id, name FROM users WHERE id = $1", [organizerId]);
  if (organizerCheck.rows.length === 0) {
    throw new ApiError(404, "Organizer not found");
  }

  const result = await query(
    `SELECT e.*,
            (SELECT COUNT(*) FROM bookings b WHERE b.event_id = e.id AND b.status = 'CONFIRMED')::int AS confirmed_bookings,
            (SELECT COALESCE(SUM(b.tickets), 0) FROM bookings b WHERE b.event_id = e.id AND b.status = 'CONFIRMED')::int AS tickets_sold,
            (SELECT COALESCE(SUM(b.total_amount), 0) FROM bookings b WHERE b.event_id = e.id AND b.status = 'CONFIRMED')::numeric AS gross_revenue,
            (SELECT COALESCE(SUM(r.amount), 0) FROM refunds r JOIN bookings b ON b.id = r.booking_id WHERE b.event_id = e.id AND r.status = 'PROCESSED')::numeric AS total_refunds
     FROM events e
     WHERE e.organizer_id = $1
     ORDER BY e.created_at DESC`,
    [organizerId]
  );

  return result.rows.map((event) => {
    const gross = Number(event.gross_revenue || 0);
    const refunds = Number(event.total_refunds || 0);
    return {
      ...event,
      gross_revenue: gross,
      total_refunds: refunds,
      net_revenue: Math.max(0, gross - refunds),
    };
  });
};

/**
 * Comprehensive analytics for a single organizer
 */
export const getOrganizerAnalytics = async (organizerId) => {
  const details = await getOrganizerDetails(organizerId);
  const events = await listOrganizerEvents(organizerId);

  return {
    organizer: details,
    events,
    summary: {
      totalEvents: details.total_events,
      totalBookings: details.total_bookings,
      ticketsSold: details.tickets_sold,
      grossRevenue: details.gross_revenue,
      totalRefunds: details.total_refunds,
      netRevenue: details.net_revenue,
    },
  };
};

/**
 * Platform-wide revenue and performance analytics across all organizers
 */
export const getPlatformRevenueAnalytics = async () => {
  const [
    counts,
    monthly,
    categories,
    recentConfirmedBookings,
    topOrganizers,
  ] = await Promise.all([
    query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'ORGANIZER')::int AS total_organizers,
        (SELECT COUNT(*) FROM users WHERE role = 'ORGANIZER' AND organizer_status = 'APPROVED')::int AS approved_organizers,
        (SELECT COUNT(*) FROM users WHERE organizer_status = 'PENDING')::int AS pending_applications,
        (SELECT COUNT(*) FROM users WHERE organizer_status = 'REJECTED')::int AS rejected_applications,
        (SELECT COUNT(*) FROM events)::int AS total_events,
        (SELECT COUNT(*) FROM bookings WHERE status = 'CONFIRMED')::int AS successful_bookings,
        (SELECT COALESCE(SUM(tickets), 0) FROM bookings WHERE status = 'CONFIRMED')::int AS total_tickets_sold,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE status = 'CONFIRMED')::numeric AS gross_booking_revenue,
        (SELECT COALESCE(SUM(amount), 0) FROM refunds WHERE status = 'PROCESSED')::numeric AS total_refunds
    `),
    query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', b.created_at), 'YYYY-MM') AS month,
        COUNT(b.id)::int AS booking_count,
        COALESCE(SUM(b.tickets), 0)::int AS tickets_sold,
        COALESCE(SUM(b.total_amount), 0)::numeric AS gross_revenue
      FROM bookings b
      WHERE b.status = 'CONFIRMED'
      GROUP BY DATE_TRUNC('month', b.created_at)
      ORDER BY month DESC
      LIMIT 12
    `),
    query(`
      SELECT 
        e.category,
        COUNT(DISTINCT e.id)::int AS event_count,
        COUNT(b.id)::int AS booking_count,
        COALESCE(SUM(b.total_amount), 0)::numeric AS revenue
      FROM events e
      LEFT JOIN bookings b ON b.event_id = e.id AND b.status = 'CONFIRMED'
      GROUP BY e.category
      ORDER BY revenue DESC
    `),
    query(`
      SELECT b.id, b.total_amount, b.tickets, b.created_at,
             u.name AS attendee_name, u.email AS attendee_email,
             e.name AS event_name, org.name AS organizer_name
      FROM bookings b
      JOIN users u ON u.id = b.user_id
      JOIN events e ON e.id = b.event_id
      JOIN users org ON org.id = e.organizer_id
      WHERE b.status = 'CONFIRMED'
      ORDER BY b.created_at DESC
      LIMIT 10
    `),
    query(`
      SELECT u.id, u.name, u.email, u.organization_name,
             (SELECT COUNT(*) FROM events e WHERE e.organizer_id = u.id)::int AS total_events,
             (SELECT COUNT(b.id) FROM bookings b JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND b.status = 'CONFIRMED')::int AS total_bookings,
             (SELECT COALESCE(SUM(b.total_amount), 0) FROM bookings b JOIN events e ON e.id = b.event_id WHERE e.organizer_id = u.id AND b.status = 'CONFIRMED')::numeric AS gross_revenue
      FROM users u
      WHERE u.role = 'ORGANIZER' AND u.organizer_status = 'APPROVED'
      ORDER BY gross_revenue DESC
      LIMIT 5
    `),
  ]);

  const row = counts.rows[0];
  const gross = Number(row.gross_booking_revenue || 0);
  const refunds = Number(row.total_refunds || 0);

  return {
    metrics: {
      totalRegisteredOrganizers: row.total_organizers,
      totalApprovedOrganizers: row.approved_organizers,
      pendingOrganizerApplications: row.pending_applications,
      rejectedOrganizerApplications: row.rejected_applications,
      totalEvents: row.total_events,
      totalSuccessfulBookings: row.successful_bookings,
      totalTicketsSold: row.total_tickets_sold,
      grossBookingRevenue: gross,
      totalRefunds: refunds,
      netBookingRevenue: Math.max(0, gross - refunds),
      currency: "INR",
    },
    monthlyTrends: monthly.rows.map((m) => ({
      ...m,
      gross_revenue: Number(m.gross_revenue),
    })),
    categoryBreakdown: categories.rows.map((c) => ({
      ...c,
      revenue: Number(c.revenue),
    })),
    recentTransactions: recentConfirmedBookings.rows,
    topOrganizers: topOrganizers.rows.map((o) => ({
      ...o,
      gross_revenue: Number(o.gross_revenue),
    })),
  };
};

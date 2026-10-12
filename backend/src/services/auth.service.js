import bcrypt from "bcrypt";
import { query } from "../db/db.js";
import { signToken } from "../middleware/auth.middleware.js";

export const registerUser = async ({
  name,
  email,
  password,
  role,
  organizationName,
  bio,
}) => {
  const { rows } = await query("SELECT id FROM users WHERE email = $1", [email]);

  if (rows.length) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const isOrganizer = role === "ORGANIZER";
  const organizerStatus = isOrganizer ? "PENDING" : null;
  const organizerAppliedAt = isOrganizer ? new Date() : null;

  const {
    rows: [user],
  } = await query(
    `INSERT INTO users (name, email, password, role, organizer_status, organizer_applied_at, organization_name, organizer_bio)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, name, email, role, organizer_status, organizer_applied_at, organizer_decided_at, organizer_rejection_reason, organization_name, organizer_bio, created_at`,
    [
      name,
      email,
      hashedPassword,
      role,
      organizerStatus,
      organizerAppliedAt,
      organizationName || null,
      bio || null,
    ]
  );

  return {
    user,
    token: signToken({
      id: user.id,
      role: user.role,
      organizer_status: user.organizer_status,
    }),
  };
};

export const loginUser = async ({ email, password }) => {
  const { rows } = await query(
    `SELECT id, name, email, password, role, organizer_status, organizer_applied_at, organizer_decided_at, organizer_rejection_reason, organization_name, organizer_bio, created_at
     FROM users WHERE email = $1`,
    [email]
  );

  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({
    id: user.id,
    role: user.role,
    organizer_status: user.organizer_status,
  });
  delete user.password;

  return { user, token };
};

export const getUserById = async (id) => {
  const { rows } = await query(
    `SELECT id, name, email, role, organizer_status, organizer_applied_at, organizer_decided_at, organizer_rejection_reason, organization_name, organizer_bio, created_at
     FROM users WHERE id = $1`,
    [id]
  );

  if (!rows.length) throw new Error("User not found");

  return rows[0];
};

export const applyForOrganizer = async (userId, { organizationName, bio } = {}) => {
  const { rows } = await query(
    "SELECT id, role, organizer_status FROM users WHERE id = $1",
    [userId]
  );
  if (!rows.length) throw new Error("User not found");
  const user = rows[0];

  if (user.organizer_status === "APPROVED") {
    throw new Error("You are already an approved organizer.");
  }

  const {
    rows: [updated],
  } = await query(
    `UPDATE users
     SET role = 'ORGANIZER',
         organizer_status = 'PENDING',
         organizer_applied_at = NOW(),
         organizer_decided_at = NULL,
         organizer_decided_by = NULL,
         organizer_rejection_reason = NULL,
         organization_name = COALESCE($2, organization_name),
         organizer_bio = COALESCE($3, organizer_bio)
     WHERE id = $1
     RETURNING id, name, email, role, organizer_status, organizer_applied_at, organizer_decided_at, organizer_rejection_reason, organization_name, organizer_bio, created_at`,
    [userId, organizationName || null, bio || null]
  );

  return updated;
};

export const getOrganizerStatus = async (userId) => {
  const { rows } = await query(
    `SELECT id, name, email, role, organizer_status, organizer_applied_at, organizer_decided_at, organizer_rejection_reason, organization_name, organizer_bio, created_at
     FROM users WHERE id = $1`,
    [userId]
  );

  if (!rows.length) throw new Error("User not found");

  return rows[0];
};
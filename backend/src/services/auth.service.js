import bcrypt from "bcrypt";
import { query } from "../db/db.js";
import { signToken } from "../middleware/auth.middleware.js";

export const registerUser = async ({ name, email, password, role }) => {
  const { rows } = await query("SELECT id FROM users WHERE email = $1", [email]);

  if (rows.length) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows: [user] } = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword, role]
  );

  return { user, token: signToken({ id: user.id, role: user.role }) };
};

export const loginUser = async ({ email, password }) => {
  const { rows } = await query(
    "SELECT id, name, email, password, role FROM users WHERE email = $1",
    [email]
  );

  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({ id: user.id, role: user.role });
  delete user.password;

  return { user, token };
};

export const getUserById = async (id) => {
  const { rows } = await query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );

  if (!rows.length) throw new Error("User not found");

  return rows[0];
};
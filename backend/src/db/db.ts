import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Single shared connection pool used across all services.
// Using `pg` directly (no ORM) keeps the data-access layer transparent —
// every query is plain, parameterized SQL.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(1);
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

// Helper for running a set of queries inside a single transaction.
// Used by the booking flow, which must atomically check/decrement
// available_seats and create the booking row.
export const withTransaction = async <T>(
  callback: (client: import("pg").PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

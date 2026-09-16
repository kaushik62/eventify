import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("Connecting to PostgreSQL as postgres:root...");
  const adminPool = new pg.Pool({
    connectionString: "postgresql://postgres:root@localhost:5432/postgres",
  });

  try {
    const roleCheck = await adminPool.query("SELECT 1 FROM pg_roles WHERE rolname = 'eventify'");
    if (roleCheck.rows.length === 0) {
      await adminPool.query("CREATE ROLE eventify WITH LOGIN PASSWORD 'eventify' SUPERUSER");
      console.log("Created role 'eventify'");
    } else {
      console.log("Role 'eventify' already exists");
    }

    await adminPool.query("GRANT ALL PRIVILEGES ON DATABASE eventify TO eventify");
    console.log("Granted database privileges to 'eventify'");
  } finally {
    await adminPool.end();
  }

  console.log("Connecting to eventify database as eventify:eventify...");
  const appPool = new pg.Pool({
    connectionString: "postgresql://eventify:eventify@localhost:5432/eventify",
  });

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await appPool.query(schemaSql);
    console.log("Applied backend/sql/schema.sql successfully");

    const tables = await appPool.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );
    console.log("Tables created:", tables.rows.map(r => r.tablename));
  } catch (err) {
    console.error("Error applying schema:", err.message);
  } finally {
    await appPool.end();
  }
}

run().catch(console.error);

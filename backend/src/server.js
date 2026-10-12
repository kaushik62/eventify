import app from "./app.js";
import { testDbConnection } from "./db/db.js";
import { runMigrations } from "./db/migrate.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Testing PostgreSQL database connection...");
    await testDbConnection();
    console.log("✓ PostgreSQL database connected successfully");

    console.log("Ensuring database migrations are up to date...");
    await runMigrations();
    console.log("✓ Database migrations verified successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✓ Eventify API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("✗ Database connection or migration failed. API server will not start.");
    console.error(error.message || error);
    process.exit(1);
  }
};

startServer();

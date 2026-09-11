import app from "./app.js";
import { testDbConnection } from "./db/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Verify PostgreSQL connection before starting the server
    console.log("Testing PostgreSQL database connection...");
    await testDbConnection();
    console.log("✓ PostgreSQL database connected successfully");

    // 2. Start Express API server
    app.listen(PORT, () => {
      console.log(`✓ Eventify API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("✗ Database connection failed. API server will not start.");
    console.error(error.message || error);
    process.exit(1);
  }
};

startServer();

import { query } from "./db.js";
import { seedAdmin } from "./seed_admin.js";

export const runMigrations = async () => {
  console.log("Running database migrations...");

  // 1. Base tables
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ORGANIZER', 'ADMIN')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      organizer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      event_date DATE NOT NULL,
      event_time TIME NOT NULL,
      price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
      total_seats INTEGER NOT NULL CHECK (total_seats > 0),
      available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
      image_url TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      tickets INTEGER NOT NULL CHECK (tickets > 0),
      total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
      status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      razorpay_order_id VARCHAR(255) NOT NULL,
      razorpay_payment_id VARCHAR(255),
      amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
      status VARCHAR(20) NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'PAID', 'FAILED')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // 2. Organizer approval extensions & refunds
  await query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS organizer_status VARCHAR(20) DEFAULT NULL CHECK (organizer_status IS NULL OR organizer_status IN ('PENDING', 'APPROVED', 'REJECTED')),
      ADD COLUMN IF NOT EXISTS organizer_applied_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS organizer_decided_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS organizer_decided_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS organizer_rejection_reason TEXT,
      ADD COLUMN IF NOT EXISTS organization_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS organizer_bio TEXT;

    CREATE INDEX IF NOT EXISTS idx_users_organizer_status ON users(organizer_status);

    CREATE TABLE IF NOT EXISTS refunds (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      payment_id INTEGER REFERENCES payments(id) ON DELETE SET NULL,
      amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
      reason TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'PROCESSED' CHECK (status IN ('PENDING', 'PROCESSED', 'FAILED')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_refunds_booking ON refunds(booking_id);
    CREATE INDEX IF NOT EXISTS idx_refunds_payment ON refunds(payment_id);
  `);

  // 3. Ensure any existing organizers in the database are marked approved if not set
  await query(`
    UPDATE users 
    SET organizer_status = 'APPROVED', organizer_applied_at = created_at
    WHERE role = 'ORGANIZER' AND organizer_status IS NULL;
  `);

  // 4. Ensure standard admin account exists
  await seedAdmin();

  console.log("Database migrations completed successfully.");
};

if (process.argv[1]?.endsWith("migrate.js")) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}

-- Eventify Database Schema
-- Run with: psql $DATABASE_URL -f sql/schema.sql

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'ORGANIZER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('CREATED', 'PAID', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'USER',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- EVENTS
CREATE TABLE IF NOT EXISTS events (
    id                  SERIAL PRIMARY KEY,
    organizer_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                VARCHAR(200) NOT NULL,
    description         TEXT NOT NULL,
    category            VARCHAR(100) NOT NULL,
    location            VARCHAR(255) NOT NULL,
    event_date          DATE NOT NULL,
    event_time          TIME NOT NULL,
    price               NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    total_seats         INTEGER NOT NULL CHECK (total_seats > 0),
    available_seats     INTEGER NOT NULL CHECK (available_seats >= 0),
    image_url           TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id        INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tickets         INTEGER NOT NULL CHECK (tickets > 0),
    total_amount    NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status          booking_status NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id                      SERIAL PRIMARY KEY,
    booking_id              INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    razorpay_order_id       VARCHAR(255) NOT NULL,
    razorpay_payment_id     VARCHAR(255),
    amount                  NUMERIC(10, 2) NOT NULL,
    status                  payment_status NOT NULL DEFAULT 'CREATED',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(razorpay_order_id);

-- Keep updated_at fresh automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Create the first administrator through a controlled provisioning flow.

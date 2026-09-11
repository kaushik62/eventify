-- ============================================
-- EVENTIFY DATABASE SCHEMA
-- PostgreSQL
-- ============================================
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users
    (
        id         SERIAL PRIMARY KEY                                                                ,
        name       VARCHAR(150) NOT NULL                                                             ,
        email      VARCHAR(255) UNIQUE NOT NULL                                                      ,
        password   VARCHAR(255) NOT NULL                                                             ,
        role       VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ORGANIZER', 'ADMIN')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()                                                  ,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
;
-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events
    (
        id SERIAL PRIMARY KEY,
        -- User who created the event
        organizer_id INTEGER NOT NULL REFERENCES users(id) ON
        DELETE
            CASCADE
            ,
            name VARCHAR(200) NOT NULL
            ,
            description TEXT NOT NULL
            ,
            category VARCHAR(100) NOT NULL
            ,
            location VARCHAR(255) NOT NULL
            ,
            event_date DATE NOT NULL
            ,
            event_time TIME NOT NULL
            ,
            price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
            ,
            total_seats INTEGER NOT NULL CHECK (total_seats > 0)
            ,
            available_seats INTEGER NOT NULL CHECK (available_seats >= 0)
            ,
            image_url TEXT NOT NULL
            ,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
            ,
            updated_at TIMESTAMP NOT NULL DEFAULT NOW() );
-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings
    (
        id SERIAL PRIMARY KEY,
        -- User who booked the event
        user_id INTEGER NOT NULL REFERENCES users(id) ON
        DELETE
            CASCADE
            ,
            -- Event that was booked
            event_id INTEGER NOT NULL REFERENCES events(id) ON
        DELETE
            CASCADE
            ,
            tickets INTEGER NOT NULL CHECK (tickets > 0)
            ,
            total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0)
            ,
            status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK ( status IN ( 'PENDING'
                                                                              ,
                                                                              'CONFIRMED'
                                                                              ,
                                                                              'CANCELLED'
                                                                              ,
                                                                              'FAILED' ) )
            ,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
            ,
            updated_at TIMESTAMP NOT NULL DEFAULT NOW() );
-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments
    (
        id         SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(id) ON
        DELETE
            CASCADE
            ,
            razorpay_order_id VARCHAR(255) NOT NULL
            ,
            razorpay_payment_id VARCHAR(255)
            ,
            amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0)
            ,
            status VARCHAR(20) NOT NULL DEFAULT 'CREATED' CHECK ( status IN ( 'CREATED'
                                                                              ,
                                                                              'PAID'
                                                                              ,
                                                                              'FAILED' ) )
            ,
            created_at TIMESTAMP NOT NULL DEFAULT NOW() );
-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_email
ON users
    (
        email
    )
;
CREATE INDEX idx_users_role
ON users
    (
        role
    )
;
CREATE INDEX idx_events_organizer
ON events
    (
        organizer_id
    )
;
CREATE INDEX idx_events_category
ON events
    (
        category
    )
;
CREATE INDEX idx_events_location
ON events
    (
        location
    )
;
CREATE INDEX idx_events_date
ON events
    (
        event_date
    )
;
CREATE INDEX idx_bookings_user
ON bookings
    (
        user_id
    )
;
CREATE INDEX idx_bookings_event
ON bookings
    (
        event_id
    )
;
CREATE INDEX idx_bookings_status
ON bookings
    (
        status
    )
;
CREATE INDEX idx_payments_booking
ON payments
    (
        booking_id
    )
;
CREATE INDEX idx_payments_order
ON payments
    (
        razorpay_order_id
    )
;
-- ============================================
-- AUTO UPDATE updated_at
-- ============================================
CREATE
OR
REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER users_updated_at
BEFORE UPDATE
ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at
BEFORE UPDATE
ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bookings_updated_at
BEFORE UPDATE
ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
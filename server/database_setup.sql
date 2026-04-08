-- Reservation & Check-in Module: Database Setup Script
-- Copy and paste this script directly into your Supabase SQL Editor.

-- 1. Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
    promo_id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    event_id INT NOT NULL, 
    discount_percentage INT DEFAULT 0,
    quantity_limit INT DEFAULT 100,
    quantity_used INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 2. Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id SERIAL PRIMARY KEY,
    reservation_code TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    event_id INT NOT NULL,
    seat_number TEXT,
    qr_code_string TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'confirmed', -- Can be 'confirmed' or 'cancelled'
    is_checked_in BOOLEAN DEFAULT FALSE,
    check_in_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create waitlists table
CREATE TABLE IF NOT EXISTS waitlists (
    waitlist_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    event_id INT NOT NULL,
    status TEXT DEFAULT 'waiting', -- Can be 'waiting', 'notified'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- (Optional) Insert some dummy data to test the promo calculations
INSERT INTO promo_codes (code, event_id, discount_percentage, quantity_limit, expires_at)
VALUES 
    ('EARLYBIRD20', 1, 20, 50, NOW() + INTERVAL '30 days'),
    ('STAGEBD50', 1, 50, 5, NOW() + INTERVAL '30 days')
ON CONFLICT DO NOTHING;

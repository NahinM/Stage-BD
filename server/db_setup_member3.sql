-- Member 3: Reviews, Engagement, Artist Interactions SQL Setup Script
-- Copy and paste this script directly into your Supabase SQL Editor.

-- 1. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    username TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (event_id, username) -- Users can only leave one review per event
);

-- 2. Followers Table
CREATE TABLE IF NOT EXISTS followers (
    id SERIAL PRIMARY KEY,
    follower_username TEXT NOT NULL,
    followed_username TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (follower_username, followed_username)
);

-- 3. Artist Profiles Table
CREATE TABLE IF NOT EXISTS artist_profiles (
    profile_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    bio TEXT,
    genres TEXT, -- Stored as comma-separated values or JSON
    social_links JSONB, -- Example: {"spotify": "...", "youtube": "..."}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Artist Media (Portfolio) Table
CREATE TABLE IF NOT EXISTS artist_media (
    media_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT, -- e.g., 'Song', 'Video Clip', 'Painting'
    media_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Contests Table
CREATE TABLE IF NOT EXISTS contests (
    contest_id SERIAL PRIMARY KEY,
    organizer_username TEXT NOT NULL,
    title TEXT NOT NULL,
    rules TEXT,
    submission_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    voting_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Contest Entries Table
CREATE TABLE IF NOT EXISTS contest_entries (
    entry_id SERIAL PRIMARY KEY,
    contest_id INT NOT NULL REFERENCES contests(contest_id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    media_url TEXT NOT NULL,
    text_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (contest_id, username) -- One entry per contest per user
);

-- 7. Votes Table
CREATE TABLE IF NOT EXISTS votes (
    vote_id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL REFERENCES contest_entries(entry_id) ON DELETE CASCADE,
    contest_id INT NOT NULL,
    username TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (contest_id, username) -- A user can only vote once per contest
);

-- (Optional) Dummy Test Data
INSERT INTO artist_profiles (username, bio, genres, social_links)
VALUES 
    ('testartist', 'A local indie band from Dhaka.', 'Indie, Rock', '{"youtube": "https://youtube.com"}')
ON CONFLICT DO NOTHING;

INSERT INTO contests (organizer_username, title, rules, submission_end_date, voting_end_date)
VALUES 
    ('adminOrg', 'Dhaka Singing Star', 'Upload your best song cover.', NOW() + INTERVAL '10 days', NOW() + INTERVAL '20 days');

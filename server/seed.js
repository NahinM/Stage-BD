import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env", quiet: true });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// IDs strictly match the ones hardcoded in the frontend components
const mainUserId = "00000000-0000-0000-0000-000000000000";
const artistId = "11111111-1111-1111-1111-111111111111";
const venueId = "22222222-2222-2222-2222-222222222222";
const eventId = "33333333-3333-3333-3333-333333333333";
const contestId = "44444444-4444-4444-4444-444444444444";
const entryId = "55555555-5555-5555-5555-555555555555";

async function seed() {
    console.log("Starting Dummy Data Seeding...");

    // 1. Users
    await supabase.from("user").upsert([
        { id: mainUserId, username: "music_fan_99", email: "fan@test.com", password: "pwd", firstname: "Test", lastname: "Viewer", city: "Dhaka", bio: "I literally love music.", is_verified: true },
        { id: artistId, username: "stage_destroyer", email: "artist@test.com", password: "pwd", firstname: "Alex", lastname: "Stage", bio: "Lead guitarist pushing boundaries.", city: "Sylhet", is_verified: true }
    ]);

    // 2. Preferences
    await supabase.from("user_preference").upsert([
        { user_id: mainUserId, preferred_genres: ["Rock"], preferred_cities: ["Sylhet", "Dhaka"] }
    ]);

    // 3. Category & Venue
    const { data: catResponse } = await supabase.from("event_category").upsert([{ name: "Rock Concert" }], { onConflict: 'name' }).select();
    const catId = catResponse ? catResponse[0].id : 1; 

    await supabase.from("venue").upsert([
        { id: venueId, name: "Sylhet Open Arena", city: "Sylhet", capacity: 5000 }
    ]);

    // 4. Event
    await supabase.from("event").upsert([{
        id: eventId,
        organizer_id: artistId,
        title: "Summer Rock Fest 2026",
        description: "The biggest rock concert of the year.",
        event_date: "2026-08-15",
        venue_id: venueId,
        category_id: catId,
        poster_url: "https://images.unsplash.com/photo-1540039155732-d674d8e87311?auto=format&fit=crop&q=80&w=800"
    }]);

    await supabase.from("event_artist").upsert([{ event_id: eventId, artist_id: artistId }]);

    // 5. Contest
    await supabase.from("contest").upsert([{
        id: contestId,
        organizer_id: artistId,
        event_id: eventId,
        title: "Opening Act Singing Contest",
        rules: "Submit a 1-minute video singing your best rock cover! Winner performs live before us.",
        submission_end: "2026-07-01T00:00:00Z"
    }]);

    // 6. Contest Entry 
    await supabase.from("contest_entry").upsert([{
        id: entryId,
        contest_id: contestId,
        user_id: mainUserId,
        content_url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Here is my epic cover of classic rock legends!",
        vote_score: 42
    }]);

    console.log("Dummy Data successfully seeded! You can now test the frontend.");
}

seed().catch(err => console.error("Seeding Error:", err));

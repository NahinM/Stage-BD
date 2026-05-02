import { supabase } from "./src/config/database.js";
import crypto from 'crypto';

async function test() {
    const eventId = crypto.randomUUID();
    const { data, error } = await supabase.from('event').insert([{
        id: eventId,
        title: "Test Event",
        organizer_id: "11111111-1111-1111-1111-111111111111",
        event_date: new Date().toISOString()
    }]).select();
    console.log("Event insert:", data, error);
}
test();

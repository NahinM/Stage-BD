import { supabase } from "./src/config/database.js";
async function check() {
    const { data } = await supabase.from('artist_profiles').select('profile_id, username, total_like').eq('username', 'sharmistha_roy').single();
    console.log("DB Data:", data);
}
check();

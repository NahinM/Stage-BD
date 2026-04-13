import { supabase } from "../../../config/database.js";

export const db_getEvents = async () => {
    const { data, error } = await supabase
        .from('event')
        .select('id, title, description, type, is_free, category_id')
        .eq('status', "published");

    if (error) {
        console.error("Error fetching events:", error);
        throw new Error("Failed to fetch events");
    }

    return data;
}
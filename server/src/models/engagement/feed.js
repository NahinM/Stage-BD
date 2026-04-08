import { supabase } from "../../config/database.js";

export const getPersonalizedFeed = async (username) => {
    const { data: allEvents, error } = await supabase
        .from('event')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
    if (error) throw error;
    return allEvents;
};

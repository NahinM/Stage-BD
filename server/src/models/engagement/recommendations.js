import { supabase } from "../../config/database.js";

export const getRecommendations = async (userId) => {
    // 1. Get user's city
    const { data: user, error: userError } = await supabase
        .from('user')
        .select('city')
        .eq('id', userId)
        .single();
    
    if (userError) {
        console.error("Error fetching user city:", userError);
        return [];
    }
    const userCity = user?.city;

    if (!userCity) {
        return [];
    }

    // 2. Fetch events where venue city matches user city
    // We use inner join on venue to filter events based on the venue's city
    const { data: events, error } = await supabase
        .from('event')
        .select(`
            *,
            event_category(name),
            venue!inner(city)
        `)
        .eq('venue.city', userCity)
        .order('event_date', { ascending: true });

    if (error) {
        console.error("Error fetching recommended events:", error);
        throw error;
    }

    // Add a score property since frontend expects it
    const scoredEvents = events.map(event => ({
        ...event,
        score: 100
    }));

    return scoredEvents;
};

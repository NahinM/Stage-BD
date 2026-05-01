import { supabase } from "../../config/database.js";

export const getRecommendations = async (userId) => {
    // 1. Get user's followed artists
    const { data: following } = await supabase
        .from('follow')
        .select('followed_id')
        .eq('follower_id', userId);
    
    const followedIds = following?.map(f => f.followed_id) || [];

    // 2. Get user's city
    const { data: user } = await supabase
        .from('user')
        .select('city')
        .eq('id', userId)
        .single();
    
    const userCity = user?.city;

    // 3. Fetch events
    // Logic: Events by followed artists OR events in user's city
    // For simplicity, we fetch all and score them
    let query = supabase.from('event').select('*, event_category(name), venue(city)');
    
    const { data: events, error } = await query;
    if (error) throw error;

    // Basic scoring
    const scoredEvents = events.map(event => {
        let score = 0;
        if (followedIds.includes(event.organizer_id)) score += 50;
        if (event.venue?.city === userCity) score += 30;
        // Random variance for "freshness"
        score += Math.floor(Math.random() * 20);
        return { ...event, score };
    });

    return scoredEvents.sort((a, b) => b.score - a.score).slice(0, 10);
};

import { supabase } from "../../config/database.js";

export const getRecommendations = async (userId) => {
    // Note: A truly powerful recommendation engine would use a custom PostgreSQL RPC (function)
    // Here we implement the logic via standard Supabase JS fetches.
    
    // 1. Get Preferred City & Genres
    const { data: prefs } = await supabase
        .from('user_preference')
        .select('preferred_genres, preferred_cities')
        .eq('user_id', userId)
        .single();
        
    const preferredCities = prefs?.preferred_cities || [];
    const preferredGenres = prefs?.preferred_genres || [];

    // 2. Get Followed Artists
    const { data: following } = await supabase
        .from('follow')
        .select('followed_id')
        .eq('follower_id', userId);
        
    const followedArtistIds = following?.map(f => f.followed_id) || [];

    // 3. To fetch events matching these criteria, we use an OR filter
    // We want Upcoming Events (date >= today)
    // Matches: User's Cities OR User's Genres OR involves Followed Artists
    
    let query = supabase
        .from('event')
        .select(`
            *,
            venue ( city ),
            event_category ( name ),
            event_artist!inner ( artist_id )
        `)
        .gte('event_date', new Date().toISOString().split('T')[0]); // Upcoming only
        
    const { data: events, error } = await query;
    if (error) throw error;
    
    // 4. Scoring Logic (In-Memory for flexibility, normally better in SQL)
    // Give points: 
    // +3 if artist is followed
    // +2 if matches preferred genre
    // +2 if matches preferred city
    // (Could also add logic for previous checkin history here)
    
    const scoredEvents = events.map(ev => {
        let score = 0;
        
        // Match Artists
        const eventArtistIds = ev.event_artist.map(ea => ea.artist_id);
        if (eventArtistIds.some(aid => followedArtistIds.includes(aid))) score += 3;
        
        // Match City
        if (ev.venue && preferredCities.includes(ev.venue.city)) score += 2;
        
        // Match Genre (Assuming event_category maps to genre)
        if (ev.event_category && preferredGenres.includes(ev.event_category.name)) score += 2;
        
        return { ...ev, score };
    }).filter(ev => ev.score > 0); // Only keep relevant events!
    
    // Sort by highest score
    scoredEvents.sort((a, b) => b.score - a.score);
    
    return scoredEvents;
};

import { supabase } from "../../config/database.js";

// Fetch all reviews for a specific event
export const getReviewsByEventId = async (eventId) => {
    const { data, error } = await supabase
        .from('event_review')
        .select(`
            id,
            event_id,
            user_id,
            review,
            created_at,
            users:user_id (
                username,
                avatar_url
            )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Add a new review for an event
export const addEventReview = async (eventId, userId, reviewText) => {
    const { data, error } = await supabase
        .from('event_review')
        .insert([{ 
            event_id: eventId, 
            user_id: userId, 
            review: reviewText 
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

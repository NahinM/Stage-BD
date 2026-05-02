import { supabase } from "../../config/database.js";

// Fetch all reviews for a specific event
export const getReviewsByEventId = async (eventId) => {
    const { data: reviews, error } = await supabase
        .from('event_review')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    if (reviews && reviews.length > 0) {
        const userIds = [...new Set(reviews.map(r => r.user_id))];
        const { data: usersData, error: usersError } = await supabase
            .from('user')
            .select('id, username, avatar_url')
            .in('id', userIds);
        
        if (!usersError && usersData) {
            const userMap = {};
            usersData.forEach(u => userMap[u.id] = u);
            reviews.forEach(r => {
                r.users = userMap[r.user_id] || null;
            });
        }
    }

    return reviews;
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

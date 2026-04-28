import { supabase } from "../../config/database.js";

// Check if user attended event (has a checkin via reservation)
export const hasAttendedEvent = async (userId, eventId) => {
    const { data, error } = await supabase
        .from('checkin')
        .select(`
            id,
            reservation!inner (
                user_id
            )
        `)
        .eq('event_id', eventId)
        .eq('reservation.user_id', userId);
        
    if (error) throw error;
    return data && data.length > 0;
};

// Get number of reviews the user left for an event
export const getReviewCountForUser = async (userId, eventId) => {
    const { count, error } = await supabase
        .from('review')
        .select('id', { count: 'exact', head: true })
        .eq('reviewer_id', userId)
        .eq('event_id', eventId);
    if (error) throw error;
    return count || 0;
};

export const createReview = async (reviewData) => {
    const { data, error } = await supabase
        .from('review')
        .insert([reviewData])
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateReview = async (reviewId, reviewerId, text) => {
    const { data, error } = await supabase
        .from('review')
        .update({ review_text: text, updated_at: new Date() })
        .match({ id: reviewId, reviewer_id: reviewerId }) // Ensure they own it
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getReviews = async (eventId) => {
    // Fetch all reviews and replies for an event. The frontend will structure the tree.
    const { data, error } = await supabase
        .from('review')
        .select(`
            id,
            event_id,
            reviewer_id,
            parent_id,
            rating,
            review_text,
            vote_score,
            created_at,
            updated_at,
            user:reviewer_id (username, avatar_url, firstname)
        `)
        .eq('event_id', eventId)
        .order('vote_score', { ascending: false });
    if (error) throw error;
    return data;
};

export const castReviewVote = async (reviewId, voterId, voteType) => {
    // Upsert the vote in review_vote
    const { error: upsertError } = await supabase
        .from('review_vote')
        .upsert({ review_id: reviewId, voter_id: voterId, vote_type: voteType });
    
    if (upsertError) throw upsertError;

    // Recalculate score via RPC or straightforward sum query
    // Supabase JS doesn't have a sum aggregation builder, so we query and calculate sum.
    const { data: votes, error: votesError } = await supabase
        .from('review_vote')
        .select('vote_type')
        .eq('review_id', reviewId);
    
    if (votesError) throw votesError;

    const newScore = votes.reduce((acc, curr) => acc + curr.vote_type, 0);

    // Update the review row with the new score
    const { data: reviewData, error: updateError } = await supabase
        .from('review')
        .update({ vote_score: newScore })
        .eq('id', reviewId)
        .select()
        .single();
        
    if (updateError) throw updateError;
    return reviewData;
};

import { supabase } from "../../config/database.js";

// Add a review
export const addReview = async (reviewData) => {
    const { data, error } = await supabase.from('review').insert([reviewData]).select().single();
    if (error) throw error;
    return data;
};

// Edit a review
export const updateReview = async (id, reviewText) => {
    const { data, error } = await supabase.from('review').update({ review_text: reviewText }).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

// Get reviews for an event (including replies)
export const getEventReviews = async (eventId) => {
    const { data, error } = await supabase
        .from('review')
        .select('*, user:reviewer_id (username, avatar_url, firstname)')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });
    
    if (error) throw error;

    // Organize into threads (parent-child)
    const reviewMap = {};
    const threads = [];

    data.forEach(review => {
        review.replies = [];
        reviewMap[review.id] = review;
        if (!review.parent_id) {
            threads.push(review);
        }
    });

    data.forEach(review => {
        if (review.parent_id && reviewMap[review.parent_id]) {
            reviewMap[review.parent_id].replies.push(review);
        }
    });

    return threads;
};

// Vote on a review
export const voteOnReview = async (reviewId, voterId, voteType) => {
    // Upsert into review_vote table (assumed to exist)
    const { error: voteError } = await supabase
        .from('review_vote')
        .upsert({ review_id: reviewId, voter_id: voterId, vote_type: voteType });
    if (voteError) throw voteError;

    // Recalculate review score
    const { data: votes, error: fetchError } = await supabase
        .from('review_vote')
        .select('vote_type')
        .eq('review_id', reviewId);
    if (fetchError) throw fetchError;

    const newScore = votes.reduce((acc, curr) => acc + curr.vote_type, 0);

    const { data, error: updateError } = await supabase
        .from('review')
        .update({ vote_score: newScore })
        .eq('id', reviewId)
        .select()
        .single();
    if (updateError) throw updateError;
    
    return data;
};

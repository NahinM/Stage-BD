import { supabase } from "../../config/database.js";

export const addReview = async (reviewData) => {
    const { data, error } = await supabase.from('reviews').insert([reviewData]).select().single();
    if (error) throw error;
    return data;
};

export const getReviewsByEvent = async (event_id) => {
    const { data, error } = await supabase.from('reviews').select('*').eq('event_id', event_id);
    if (error) throw error;
    return data;
};

export const deleteReview = async (review_id, username) => {
    const { data, error } = await supabase.from('reviews').delete().eq('review_id', review_id).eq('username', username).select();
    if (error) throw error;
    return data;
};

export const updateReview = async (review_id, username, rating, review_text) => {
    const { data, error } = await supabase.from('reviews')
        .update({ rating, review_text, updated_at: new Date().toISOString() })
        .eq('review_id', review_id)
        .eq('username', username)
        .select().single();
    if (error) throw error;
    return data;
};

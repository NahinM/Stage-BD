import { supabase } from "../../config/database.js";

export const createProfile = async (profileData) => {
    // profileData contains username, bio, genres, social_links
    const { data, error } = await supabase.from('artist_profiles').insert([profileData]).select().single();
    if (error) throw error;
    return data;
};

export const updateProfile = async (username, updates) => {
    const { data, error } = await supabase.from('artist_profiles').update(updates).eq('username', username).select().single();
    if (error) throw error;
    return data;
};

export const getProfile = async (username) => {
    const { data, error } = await supabase.from('artist_profiles').select('*').eq('username', username).single();
    if (error) return null;
    return data;
};

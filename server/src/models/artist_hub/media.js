import { supabase } from "../../config/database.js";

export const uploadMedia = async (mediaData) => {
    const { data, error } = await supabase.from('artist_media').insert([mediaData]).select().single();
    if (error) throw error;
    return data;
};

export const getMediaByArtist = async (username) => {
    const { data, error } = await supabase.from('artist_media').select('*').eq('username', username);
    if (error) throw error;
    return data;
};

export const deleteMedia = async (media_id, username) => {
    const { data, error } = await supabase.from('artist_media').delete().eq('media_id', media_id).eq('username', username).select();
    if (error) throw error;
    return data;
};

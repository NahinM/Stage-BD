import { supabase } from "../../config/database.js";

export const followUser = async (follower, followed) => {
    const { data, error } = await supabase.from('followers').insert([{ follower_username: follower, followed_username: followed }]).select();
    if (error) throw error;
    return data;
};

export const unfollowUser = async (follower, followed) => {
    const { data, error } = await supabase.from('followers').delete().eq('follower_username', follower).eq('followed_username', followed).select();
    if (error) throw error;
    return data;
};

export const getFollowers = async (username) => {
    const { data, error } = await supabase.from('followers').select('*').eq('followed_username', username);
    if (error) throw error;
    return data;
};

export const getFollowing = async (username) => {
    const { data, error } = await supabase.from('followers').select('*').eq('follower_username', username);
    if (error) throw error;
    return data;
};

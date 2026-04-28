import { supabase } from "../../config/database.js";

// Add a follow record
export const followUser = async (followerId, followedId) => {
    const { data, error } = await supabase
        .from('follow')
        .insert([{ follower_id: followerId, followed_id: followedId }])
        .select()
        .single();
    return { data, error };
};

// Remove a follow record
export const unfollowUser = async (followerId, followedId) => {
    const { data, error } = await supabase
        .from('follow')
        .delete()
        .match({ follower_id: followerId, followed_id: followedId });
    return { data, error };
};

// Get list of followers
export const getFollowers = async (userId) => {
    const { data, error } = await supabase
        .from('follow')
        .select('follower_id, user:follower_id (username, firstname, lastname, avatar_url)')
        .eq('followed_id', userId);
    return { data, error };
};

// Get list of users the user is following
export const getFollowing = async (userId) => {
    const { data, error } = await supabase
        .from('follow')
        .select('followed_id, user:followed_id (username, firstname, lastname, avatar_url)')
        .eq('follower_id', userId);
    return { data, error };
};
// Get follower count
export const getFollowerCount = async (userId) => {
    const { count, error } = await supabase
        .from('follow')
        .select('id', { count: 'exact', head: true })
        .eq('followed_id', userId);
    return { count, error };
};

// Check if a user follows another
export const checkFollowStatus = async (followerId, followedId) => {
    const { data, error } = await supabase
        .from('follow')
        .select('id')
        .match({ follower_id: followerId, followed_id: followedId })
        .maybeSingle();
    return { isFollowing: !!data, error };
};

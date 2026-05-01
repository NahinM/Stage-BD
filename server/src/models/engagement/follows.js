import { supabase } from "../../config/database.js";

// Helper to get UUID from ID (handles Profile ID, Username, or already a UUID)
const getUUID = async (id) => {
    if (!id) return null;
    
    // If it's already a UUID (contains dashes and is long), return it
    if (typeof id === 'string' && id.includes('-') && id.length > 30) {
        return id;
    }

    try {
        // Try searching user table by username
        const { data: userByUsername } = await supabase
            .from('user')
            .select('id')
            .eq('username', id)
            .maybeSingle();
        
        if (userByUsername) {
            console.log(`Resolved username ${id} to UUID ${userByUsername.id}`);
            return userByUsername.id;
        }

        // Try searching artist_profiles by profile_id
        if (!isNaN(Number(id))) {
            const { data: profile } = await supabase
                .from('artist_profiles')
                .select('username')
                .eq('profile_id', Number(id))
                .maybeSingle();

            if (profile) {
                const { data: user } = await supabase
                    .from('user')
                    .select('id')
                    .eq('username', profile.username)
                    .maybeSingle();
                if (user) {
                    console.log(`Resolved profile_id ${id} (username: ${profile.username}) to UUID ${user.id}`);
                    return user.id;
                }
            }
        }
    } catch (e) {
        console.error("Error in getUUID:", e);
    }

    console.warn(`Could not resolve ID ${id} to a UUID`);
    return id; 
};

// Add a follow record
export const followUser = async (followerId, followedId) => {
    const fUUID = await getUUID(followerId);
    const tUUID = await getUUID(followedId);

    const { data, error } = await supabase
        .from('follow')
        .insert([{ follower_id: fUUID, followed_id: tUUID }])
        .select()
        .single();
    return { data, error };
};

// Remove a follow record
export const unfollowUser = async (followerId, followedId) => {
    const fUUID = await getUUID(followerId);
    const tUUID = await getUUID(followedId);

    const { data, error } = await supabase
        .from('follow')
        .delete()
        .match({ follower_id: fUUID, followed_id: tUUID });
    return { data, error };
};

// Get follower count
export const getFollowerCount = async (userId) => {
    const uuid = await getUUID(userId);
    const { count, error } = await supabase
        .from('follow')
        .select('id', { count: 'exact', head: true })
        .eq('followed_id', uuid);
    return { count: count || 0, error };
};

// Check if a user follows another
export const checkFollowStatus = async (followerId, followedId) => {
    const fUUID = await getUUID(followerId);
    const tUUID = await getUUID(followedId);

    const { data, error } = await supabase
        .from('follow')
        .select('id')
        .match({ follower_id: fUUID, followed_id: tUUID })
        .maybeSingle();
    return { isFollowing: !!data, error };
};

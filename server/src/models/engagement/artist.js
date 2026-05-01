import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../../config/env-variables.js";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get UUID from ID (handles Profile ID, Username, or already a UUID)
const getUUID = async (id) => {
    if (!id) return null;
    if (typeof id === 'string' && id.includes('-') && id.length > 30) return id;
    try {
        const { data: userByUsername } = await supabase.from('user').select('id').eq('username', id).maybeSingle();
        if (userByUsername) return userByUsername.id;
        if (!isNaN(Number(id))) {
            const { data: profile } = await supabase.from('artist_profiles').select('username').eq('profile_id', Number(id)).maybeSingle();
            if (profile) {
                const { data: user } = await supabase.from('user').select('id').eq('username', profile.username).maybeSingle();
                if (user) return user.id;
            }
        }
    } catch (e) { console.error(e); }
    return id; 
};

export const castVote = async (artist_id, voter_id, vote_type) => {
    const aUUID = await getUUID(artist_id);
    const vUUID = await getUUID(voter_id);

    // 1. Check if vote exists
    const { data: existing } = await supabase
        .from('artist_vote')
        .select('id')
        .match({ voted_id: aUUID, voter_id: vUUID })
        .maybeSingle();

    if (vote_type === 0) {
        if (existing) {
            const { error } = await supabase.from('artist_vote').delete().eq('id', existing.id);
            if (error) throw error;
        }
        return { success: true };
    }

    if (existing) {
        // 2. Update existing vote
        const { error } = await supabase
            .from('artist_vote')
            .update({ vote_type })
            .eq('id', existing.id);
        if (error) throw error;
    } else {
        // 3. Insert new vote
        const { error } = await supabase
            .from('artist_vote')
            .insert([{ voted_id: aUUID, voter_id: vUUID, vote_type }]);
        if (error) throw error;
    }
    return { success: true };
};

export const getVoteStatus = async (artist_id, voter_id) => {
    const aUUID = await getUUID(artist_id);
    const vUUID = await getUUID(voter_id);

    const { data, error } = await supabase
        .from('artist_vote')
        .select('vote_type')
        .match({ voted_id: aUUID, voter_id: vUUID })
        .maybeSingle();
    
    return { vote_type: data?.vote_type || null, error };
};

export const getScore = async (artist_id) => {
    const aUUID = await getUUID(artist_id);
    const { data, error } = await supabase
        .from('artist_vote')
        .select('vote_type')
        .eq('voted_id', aUUID);

    if (error) throw error;
    return data?.reduce((acc, curr) => acc + curr.vote_type, 0) || 0;
};

export const getArtistDetails = async (artistId) => {
    // 1. Try to find the profile in 'artist_profiles' by profile_id (integer) or username
    // Based on user screenshot, profile_id is the primary key and is an integer.
    let query = supabase.from('artist_profiles').select('*');
    
    if (!isNaN(Number(artistId))) {
        query = query.eq('profile_id', Number(artistId));
    } else {
        query = query.eq('username', artistId);
    }

    const { data: profile, error: profileError } = await query.maybeSingle();

    if (profileError) throw profileError;

    if (!profile) {
        // Fallback: Check if artistId is actually a user ID in the 'user' table
        const { data: userById, error: userByIdError } = await supabase
            .from('user')
            .select('id, username, firstname, lastname, avatar_url, city, bio')
            .eq('id', `${artistId}`)
            .maybeSingle();
        
        if (userById) {
            // Found a user, now try to find their artist profile by username
            const { data: profileByUsername } = await supabase
                .from('artist_profiles')
                .select('*')
                .eq('username', userById.username)
                .maybeSingle();
            
            return {
                id: userById.id,
                username: userById.username,
                firstname: userById.firstname || "",
                lastname: userById.lastname || "",
                avatar_url: userById.avatar_url || "",
                city: userById.city || "",
                bio: profileByUsername?.bio || userById.bio || "",
                genres: profileByUsername?.genres || "",
                social_links: profileByUsername?.social_links || {}
            };
        }
        
        throw { code: 'PGRST116', message: "Artist not found" };
    }

    // 2. Fetch the corresponding user data using the username from the profile
    const { data: user, error: userError } = await supabase
        .from('user')
        .select('id, firstname, lastname, avatar_url, city, bio')
        .eq('username', profile.username)
        .maybeSingle();

    // 3. Merge and return
    return {
        id: profile.profile_id, // Use profile_id as the primary identifier
        user_id: user?.id || null,
        username: profile.username,
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        avatar_url: user?.avatar_url || "",
        city: user?.city || "",
        bio: profile.bio || user?.bio || "",
        genres: profile.genres || "",
        social_links: profile.social_links || {}
    };
};

export const getArtistEvents = async (artistId) => {
    // Resolve artistId to actual UUID if it's a username
    const { data: user } = await supabase
        .from('user')
        .select('id')
        .or(`id.eq.${artistId},username.eq.${artistId}`)
        .maybeSingle();
    
    const targetId = user?.id || artistId;

    const { data, error } = await supabase
        .from('event_artist')
        .select('event!inner(*, venue(name, city))')
        .eq('artist_id', `${targetId}`);
    if (error) throw error;
    return data.map(e => e.event);
};

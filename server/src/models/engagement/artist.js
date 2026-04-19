import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../../config/env-variables.js";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const castVote = async (artist_id, voter_id, vote_type) => {
    const { data, error } = await supabase
        .from('artist_vote')
        .upsert({ voted_artist_id: artist_id, voter_id, vote_type }, { onConflict: 'voted_artist_id, voter_id' });
    if (error) throw error;
    return data;
};

export const getScore = async (artist_id) => {
    const { data, error } = await supabase
        .from('artist_vote')
        .select('vote_type')
        .eq('voted_artist_id', artist_id);
    
    if (error) throw error;
    
    // Calculate net score natively
    const score = data.reduce((acc, curr) => acc + curr.vote_type, 0);
    return score;
};

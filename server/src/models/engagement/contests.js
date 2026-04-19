import { supabase } from "../../config/database.js";

// Fetch Contest details
export const getContest = async (contestId) => {
    const { data, error } = await supabase.from('contest').select('*').eq('id', contestId).single();
    if (error) throw error;
    return data;
};

// Add Contest Entry
export const addContestEntry = async (entryData) => {
    const { data, error } = await supabase.from('contest_entry').insert([entryData]).select().single();
    if (error) throw error;
    return data;
};

// Get Entries (Leaderboard sorted by vote_score)
export const getContestLeaderboard = async (contestId) => {
    const { data, error } = await supabase
        .from('contest_entry')
        .select('*, user:user_id (username, avatar_url, firstname)')
        .eq('contest_id', contestId)
        .order('vote_score', { ascending: false });
    if (error) throw error;
    return data;
};

// Cast Vote
export const castVote = async (entryId, voterId, voteType) => {
    // Upsert into contest_vote
    const { error: upsertError } = await supabase
        .from('contest_vote')
        .upsert({ entry_id: entryId, voter_id: voterId, vote_type: voteType });
    if (upsertError) throw upsertError;

    // Recalculate score
    const { data: votes, error: votesError } = await supabase
        .from('contest_vote')
        .select('vote_type')
        .eq('entry_id', entryId);
    if (votesError) throw votesError;

    const newScore = votes.reduce((acc, curr) => acc + curr.vote_type, 0);

    // Update contest_entry vote_score
    const { data: entryData, error: updateError } = await supabase
        .from('contest_entry')
        .update({ vote_score: newScore })
        .eq('id', entryId)
        .select()
        .single();
        
    if (updateError) throw updateError;
    return entryData;
};

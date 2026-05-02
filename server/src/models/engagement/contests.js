import { supabase } from "../../config/database.js";
import crypto from 'crypto';

// Fetch Contest details
export const getContest = async (contestId) => {
    const { data, error } = await supabase.from('contest').select('*').eq('id', `${contestId}`).single();
    if (error) throw error;
    return data;
};

// Add Contest Entry
export const addContestEntry = async (entryData) => {
    // Check if user already submitted to this contest
    const { data: existing } = await supabase
        .from('contest_entry')
        .select('id')
        .match({ contest_id: entryData.contest_id, user_id: entryData.user_id })
        .maybeSingle();
    
    if (existing) {
        throw new Error("You have already submitted an entry for this contest.");
    }

    const { data, error } = await supabase.from('contest_entry').insert([entryData]).select().single();
    if (error) throw error;
    return data;
};

// Get Entries (Leaderboard sorted by vote_score)
export const getContestLeaderboard = async (contestId) => {
    const { data, error } = await supabase
        .from('contest_entry')
        .select('*, user:user_id (username, avatar_url, firstname)')
        .eq('contest_id', `${contestId}`)
        .order('vote_score', { ascending: false });
    if (error) throw error;
    return data;
};

// Cast Vote
export const castVote = async (entryId, voterId, voteType) => {
    // entryId conceptually represents the voted_to
    // Check existing vote
    const { data: existing } = await supabase
        .from('contest_vote')
        .select('id, vote_type')
        .match({ voted_to: entryId, voter_id: voterId })
        .maybeSingle();

    if (existing) {
        if (existing.vote_type === voteType) {
            if (voteType === "UP") {
                throw new Error("you already liked the participator");
            } else {
                throw new Error("you already disliked the participator");
            }
        }
        
        const { error } = await supabase
            .from('contest_vote')
            .update({ vote_type: voteType })
            .eq('id', existing.id);
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('contest_vote')
            .insert([{ voted_to: entryId, voter_id: voterId, vote_type: voteType }]);
        if (error) throw error;
    }

    // Recalculate score
    const { data: votes, error: votesError } = await supabase
        .from('contest_vote')
        .select('vote_type')
        .eq('voted_to', `${entryId}`);
    if (votesError) throw votesError;

    const newScore = votes.reduce((acc, curr) => acc + (curr.vote_type === "UP" ? 1 : curr.vote_type === "DOWN" ? -1 : 0), 0);

    // Update contest_entry vote_score
    const { data: entryData, error: updateError } = await supabase
        .from('contest_entry')
        .update({ vote_score: newScore })
        .eq('id', `${entryId}`)
        .select()
        .single();

    if (updateError) throw updateError;
    return entryData;
};

// Create Contest
export const createContest = async (contestData) => {
    const submissionStart = new Date();
    const submissionEnd = new Date(submissionStart);
    submissionEnd.setDate(submissionEnd.getDate() + 5);

    // Generate event ID and insert placeholder event to satisfy foreign key constraint
    const eventId = crypto.randomUUID();
    const { error: eventError } = await supabase.from('event').insert([{
        id: eventId,
        title: `Contest Event: ${contestData.title}`,
        organizer_id: contestData.organizer_id,
        event_date: submissionStart.toISOString()
    }]);
    if (eventError) throw eventError;

    const newContest = {
        title: contestData.title,
        VENUE: contestData.venue,
        result_date: contestData.prize_giving_time,
        organizer_id: contestData.organizer_id,
        event_id: eventId,
        submission_start: submissionStart.toISOString(),
        submission_end: submissionEnd.toISOString(),
        rules: contestData.rules || "Standard Contest Rules"
    };

    const { data, error } = await supabase.from('contest').insert([newContest]).select().single();
    if (error) throw error;
    return data;
};
// Get all contests
export const getAllContests = async () => {
    const { data, error } = await supabase
        .from('contest')
        .select('*, event(title)')
        .order('submission_end', { ascending: false });
    if (error) throw error;
    return data;
};

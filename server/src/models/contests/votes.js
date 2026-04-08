import { supabase } from "../../config/database.js";

export const addVote = async (voteData) => {
    const { data, error } = await supabase.from('votes').insert([voteData]).select().single();
    if (error) throw error;
    return data;
};

export const getVotesForContest = async (contest_id) => {
    const { data, error } = await supabase.from('votes').select('entry_id').eq('contest_id', contest_id);
    if (error) throw error;
    return data;
};

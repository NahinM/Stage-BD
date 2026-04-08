import { supabase } from "../../config/database.js";

export const createContest = async (contestData) => {
    const { data, error } = await supabase.from('contests').insert([contestData]).select().single();
    if (error) throw error;
    return data;
};

export const getContests = async () => {
    const { data, error } = await supabase.from('contests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const submitEntry = async (entryData) => {
    const { data, error } = await supabase.from('contest_entries').insert([entryData]).select().single();
    if (error) throw error;
    return data;
};

export const getEntriesByContest = async (contest_id) => {
    const { data, error } = await supabase.from('contest_entries').select('*').eq('contest_id', contest_id);
    if (error) throw error;
    return data;
};

export const getContestById = async (contest_id) => {
     const { data, error } = await supabase.from('contests').select('*').eq('contest_id', contest_id).single();
     if (error) throw error;
     return data;
}

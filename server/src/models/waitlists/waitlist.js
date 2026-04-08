import { supabase } from "../../config/database.js";

export const joinWaitlistModel = async (waitlistData) => {
    const { data, error } = await supabase
        .from('waitlists')
        .insert([waitlistData])
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getFirstInWaitlist = async (event_id) => {
     const { data, error } = await supabase
        .from('waitlists')
        .select('*')
        .eq('event_id', event_id)
        .eq('status', 'waiting')
        .order('joined_at', { ascending: true })
        .limit(1)
        .single();
     if (error) return null;
     return data;
}

export const updateWaitlistStatus = async (waitlist_id, status) => {
      const { data, error } = await supabase
        .from('waitlists')
        .update({ status })
        .eq('waitlist_id', waitlist_id)
        .select()
        .single();
      if (error) throw error;
      return data;
}

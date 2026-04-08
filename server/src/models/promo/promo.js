import { supabase } from "../../config/database.js";

export const getValidPromo = async (code, event_id) => {
    const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .eq('event_id', event_id)
        .single();
    if (error) return null;
    return data;
};

export const incrementPromoUsage = async (promo_id, current_used) => {
     const { data, error } = await supabase
        .from('promo_codes')
        .update({ quantity_used: current_used + 1 })
        .eq('promo_id', promo_id)
        .select()
        .single();
     if (error) throw error;
     return data;
};

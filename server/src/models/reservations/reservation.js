import { supabase } from "../../config/database.js";

export const getUserReservations = async (username) => {
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('username', username);
    if (error) throw error;
    return data;
};

export const createReservation = async (reservationData) => {
    const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateReservationStatus = async (reservation_id, status) => {
    const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('reservation_id', reservation_id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const confirmCheckIn = async (qr_code_string) => {
    const { data, error } = await supabase
        .from('reservations')
        .update({ is_checked_in: true, check_in_time: new Date().toISOString() })
        .eq('qr_code_string', qr_code_string)
        .eq('status', 'confirmed')
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getReservationByQR = async (qr_code_string) => {
     const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('qr_code_string', qr_code_string)
        .single();
    if (error) throw error;
    return data;
};

export const getReservationsByEvent = async (eventId) => {
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('event_id', eventId);
    if (error) throw error;
    return data;
};

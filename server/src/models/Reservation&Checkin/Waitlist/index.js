import { supabase } from "../../../config/database.js";

export const isEventFull = async (eventId) => {
  const { data, error } = await supabase
    .from("event")
    .select("seat_limit, seats_reserved")
    .eq("id", eventId)
    .single();
  if (error || !data) return true;
  return data.seats_reserved >= data.seat_limit;
};

export const getWaitlistPosition = async (eventId, userId) => {
  const { data } = await supabase
    .from("waitlist")
    .select("id, position")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .eq("status", "waiting")
    .single();
  return data;
};

export const joinWaitlist = async (eventId, userId) => {
  const existing = await getWaitlistPosition(eventId, userId);
  if (existing) return { error: "Already on waitlist" };

  const { data: maxRow } = await supabase
    .from("waitlist")
    .select("position")
    .eq("event_id", eventId)
    .eq("status", "waiting")
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const nextPosition = maxRow?.position ? maxRow.position + 1 : 1;

  const { data, error } = await supabase
    .from("waitlist")
    .insert({ event_id: eventId, user_id: userId, position: nextPosition, status: "waiting" })
    .select()
    .single();

  return { data, error };
};

export const getWaitlistByEvent = async (eventId) => {
  const { data, error } = await supabase
    .from("waitlist")
    .select(`id, position, joined_at,
      user:user_id (id, firstname, lastname, email, username)`)
    .eq("event_id", eventId)
    .eq("status", "waiting")
    .order("position", { ascending: true });
  return { data, error };
};

export const cancelWaitlistEntry = async (waitlistId) => {
  const { data, error } = await supabase
    .from("waitlist")
    .update({ status: "cancelled" })
    .eq("id", waitlistId)
    .select()
    .single();
  return { data, error };
};

export const getOrganizerEvents = async (organizerId) => {
  const { data, error } = await supabase
    .from("event")
    .select("id, title, event_date, seat_limit, seats_reserved, status")
    .eq("organizer_id", organizerId)
    .order("event_date", { ascending: false });
  return { data, error };
};
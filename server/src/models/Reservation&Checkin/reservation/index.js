import { supabase } from "../../../config/database.js";

export const getEventWithSlots = async (eventId) => {
    const { data, error } = await supabase
        .from("event")
        .select("id, title, description, poster_url, event_date, event_time, seat_limit, seats_reserved, is_free, price, status, type, streaming_link, venue:venue_id(name, address, city)")
        .eq("id", eventId)
        .single();
    if (error) { console.error("Error fetching event:", error); return null; }
    return data;
};

export const getTicketSlots = async (eventId) => {
    const { data, error } = await supabase
        .from("ticket_slot")
        .select("id, slot_type, price, quantity, sold, valid_until")
        .eq("event_id", eventId);
    if (error) { console.error("Error fetching slots:", error); return null; }
    return data;
};

export const validatePromoCode = async (eventId, code) => {
    const { data, error } = await supabase
        .from("promo_code")
        .select("id, discount_percent, max_uses, used_count, expires_at")
        .eq("event_id", eventId)
        .eq("code", code)
        .single();
    if (error) return null;
    if (data.max_uses && data.used_count >= data.max_uses) return null;
    if (data.expires_at && new Date(data.expires_at) < new Date()) return null;
    return data;
};

export const checkExistingReservation = async (userId, eventId) => {
    const { data, error } = await supabase
        .from("reservation")
        .select("id")
        .eq("user_id", userId)
        .eq("event_id", eventId)
        .eq("status", "confirmed")
        .single();
    if (error) return null;
    return data;
};

export const createReservation = async ({ userId, eventId, slotId, promoCodeId, reservationCode, finalPrice }) => {
    const { data, error } = await supabase
        .from("reservation")
        .insert({
            user_id: userId,
            event_id: eventId,
            ticket_slot_id: slotId,
            promo_code_id: promoCodeId || null,
            reservation_code: reservationCode,
            qr_data: reservationCode,
            status: "confirmed",
            final_price: finalPrice,
        })
        .select()
        .single();
    if (error) { console.error("Error creating reservation:", error); return null; }
    return data;
};

export const incrementSlotSold = async (slotId) => {
    const { error } = await supabase.rpc("increment_slot_sold", { slot_id: slotId });
    if (error) console.error("Error incrementing slot:", error);
};

export const incrementSeatsReserved = async (eventId) => {
    const { error } = await supabase.rpc("increment_seats_reserved", { event_id: eventId });
    if (error) console.error("Error incrementing seats:", error);
};

export const incrementPromoUsed = async (promoId) => {
    const { error } = await supabase
        .from("promo_code")
        .update({ used_count: supabase.rpc("used_count + 1") });
    if (error) console.error("Error updating promo:", error);
};

export const getUserReservations = async (userId) => {
    const { data, error } = await supabase
        .from("reservation")
        .select("id, reservation_code, status, final_price, created_at, event:event_id(id, title, event_date, event_time, poster_url, venue:venue_id(name, city)), ticket_slot:ticket_slot_id(slot_type, price)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    if (error) { console.error("Error fetching reservations:", error); return null; }
    return data;
};

export const cancelReservation = async (reservationId, userId) => {
  const { data, error } = await supabase
    .from("reservation")
    .update({ status: "cancelled" })
    .eq("id", reservationId)
    .eq("user_id", userId)
    .select("id, event_id, ticket_slot_id, final_price")
    .single();

  if (error) { console.error("Error cancelling reservation:", error); return null; }

  // decrement seats
  await supabase.rpc("decrement_seats_reserved", { event_id: data.event_id });
  if (data.ticket_slot_id) {
    await supabase.rpc("decrement_slot_sold", { slot_id: data.ticket_slot_id });
  }

  // check waitlist — promote first person
  const { data: next } = await supabase
    .from("waitlist")
    .select("id, user_id")
    .eq("event_id", data.event_id)
    .eq("status", "waiting")
    .order("position", { ascending: true })
    .limit(1)
    .single();

  if (next) {
    // create reservation for waitlisted user
    const { nanoid } = await import("nanoid");
    const reservationCode = nanoid(10).toUpperCase();

    await supabase
      .from("reservation")
      .insert({
        user_id: next.user_id,
        event_id: data.event_id,
        ticket_slot_id: data.ticket_slot_id,
        reservation_code: reservationCode,
        status: "confirmed",
        final_price: data.final_price,
      });

    // increment seats back
    await supabase.rpc("increment_seats_reserved", { event_id: data.event_id });
    if (data.ticket_slot_id) {
      await supabase.rpc("increment_slot_sold", { slot_id: data.ticket_slot_id });
    }

    // remove from waitlist
    await supabase
      .from("waitlist")
      .update({ status: "cancelled" })
      .eq("id", next.id);
  }

  return data;
};
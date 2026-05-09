import { supabase, makeError } from "./_utils.js";

export const listEventAnalytics = async (organizerUsername) => {
  if (!organizerUsername) {
    throw makeError("Organizer username is required.", 400);
  }

  const { data: organizerUser, error: userError } = await supabase
    .from("user")
    .select("id, username")
    .eq("username", organizerUsername)
    .maybeSingle();

  if (userError) throw userError;

  if (!organizerUser) {
    throw makeError("Organizer user not found.", 404);
  }

  const { data: roleRows, error: roleError } = await supabase
    .from("user_role")
    .select("role")
    .eq("user_id", organizerUser.id);

  if (roleError) throw roleError;

  const isOrganizer = (roleRows || []).some(
    (row) => String(row.role).toLowerCase() === "organizer"
  );

  if (!isOrganizer) {
    throw makeError("Only organizer users can view analytics.", 403);
  }

  const { data: events, error: eventsError } = await supabase
    .from("event")
    .select("id, title, organizer_id")
    .eq("organizer_id", organizerUser.id)
    .order("title", { ascending: true });

  if (eventsError) throw eventsError;

  const organizerEventIds = (events || []).map((event) => event.id);
  const analyticsMap = new Map();

  (events || []).forEach((event) => {
    analyticsMap.set(event.id, {
      eventId: event.id,
      eventTitle: event.title || "Untitled Event",
      reservations: 0,
      promoUses: 0,
      uniqueUserSet: new Set(),
      promoCodeIdSet: new Set(),
      reservationCodeSet: new Set(),
    });
  });

  if (organizerEventIds.length === 0) return [];

  const { data: reservations, error: reservationError } = await supabase
    .from("reservation")
    .select("id, user_id, event_id, promo_code_id, ticket_slot_id, reservation_code")
    .in("event_id", organizerEventIds);

  if (reservationError) throw reservationError;

  (reservations || []).forEach((reservation) => {
    const eventId = reservation.event_id;

    if (!analyticsMap.has(eventId)) return;

    const item = analyticsMap.get(eventId);

    item.reservations += 1;

    if (reservation.user_id) {
      item.uniqueUserSet.add(String(reservation.user_id));
    }

    if (reservation.promo_code_id) {
      item.promoUses += 1;
      item.promoCodeIdSet.add(String(reservation.promo_code_id));
    }

    if (reservation.reservation_code) {
      item.reservationCodeSet.add(String(reservation.reservation_code));
    }
  });

  return Array.from(analyticsMap.values()).map((item) => ({
    eventId: item.eventId,
    eventTitle: item.eventTitle,
    reservations: item.reservations,
    promoUses: item.promoUses,
    uniqueUsers: item.uniqueUserSet.size,
    promoCodeIds: Array.from(item.promoCodeIdSet),
    reservationCodes: Array.from(item.reservationCodeSet),
  }));
};
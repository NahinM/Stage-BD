import { supabase } from "../../../config/database.js";

export const getReservationByCode = async (code) => {
  const { data, error } = await supabase
    .from("reservation")
    .select(`
      id,
      user_id,
      event_id,
      status,
      reservation_code,
      user:user_id (
        firstname,
        lastname,
        username
      )
    `)
    .eq("reservation_code", code)
    .single();

  if (error) {
    console.error("getReservationByCode error:", error);
    return null;
  }

  return {
    ...data,
    firstname: data.user?.firstname || null,
    lastname: data.user?.lastname || null,
    username: data.user?.username || null,
  };
};

export const getCheckinByReservation = async (reservationId) => {
  const { data, error } = await supabase
    .from("checkin")
    .select("*")
    .eq("reservation_id", reservationId)
    .maybeSingle();

  if (error) {
    console.error("getCheckinByReservation error:", error);
    return null;
  }

  return data;
};

export const createCheckin = async (reservationId, staffId, eventId) => {
  const { data, error } = await supabase
    .from("checkin")
    .insert([
      {
        reservation_id: reservationId,
        staff_id: staffId,
        event_id: eventId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("createCheckin error:", error);
    return null;
  }

  return data;
};

export const getEventCheckins = async (eventId) => {
  const { data, error } = await supabase
    .from("checkin")
    .select(`
      id,
      reservation_id,
      staff_id,
      checked_in_at,
      event_id,
      reservation:reservation_id (
        id,
        reservation_code,
        user:user_id (
          firstname,
          lastname,
          username
        )
      )
    `)
    .eq("event_id", eventId)
    .order("checked_in_at", { ascending: false });

  if (error) {
    console.error("getEventCheckins error:", error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    reservation_id: item.reservation_id,
    staff_id: item.staff_id,
    checked_in_at: item.checked_in_at,
    event_id: item.event_id,
    reservation_code: item.reservation?.reservation_code || null,
    firstname: item.reservation?.user?.firstname || null,
    lastname: item.reservation?.user?.lastname || null,
    username: item.reservation?.user?.username || null,
  }));
};

export const getReservationById = async (reservationId) => {
  const { data, error } = await supabase
    .from("reservation")
    .select(`
      id,
      user_id,
      event_id,
      status,
      reservation_code,
      user:user_id (
        firstname,
        lastname,
        username,
        email,
        phone
      )
    `)
    .eq("id", reservationId)
    .single();

  if (error) {
    console.error("getReservationById error:", error);
    return null;
  }

  return {
    ...data,
    firstname: data.user?.firstname || null,
    lastname: data.user?.lastname || null,
    username: data.user?.username || null,
    email: data.user?.email || null,
    phone: data.user?.phone || null,
  };
};


export const searchEventGuests = async (eventId, query) => {
  const { data, error } = await supabase
    .from("reservation")
    .select(`
      id,
      event_id,
      status,
      reservation_code,
      user:user_id (
        firstname,
        lastname,
        username,
        email,
        phone
      )
    `)
    .eq("event_id", eventId);

  if (error) {
    console.error("searchEventGuests error:", error);
    return [];
  }

  const q = query.toLowerCase();

  return (data || [])
    .filter((item) => {
      const firstname = item.user?.firstname?.toLowerCase() || "";
      const lastname = item.user?.lastname?.toLowerCase() || "";
      const username = item.user?.username?.toLowerCase() || "";
      const email = item.user?.email?.toLowerCase() || "";
      const phone = item.user?.phone?.toLowerCase() || "";
      const reservationCode = item.reservation_code?.toLowerCase() || "";

      return (
        firstname.includes(q) ||
        lastname.includes(q) ||
        `${firstname} ${lastname}`.trim().includes(q) ||
        username.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        reservationCode.includes(q)
      );
    })
    .map((item) => ({
      reservation_id: item.id,
      event_id: item.event_id,
      status: item.status,
      reservation_code: item.reservation_code,
      firstname: item.user?.firstname || null,
      lastname: item.user?.lastname || null,
      username: item.user?.username || null,
      email: item.user?.email || null,
      phone: item.user?.phone || null,
    }));
};
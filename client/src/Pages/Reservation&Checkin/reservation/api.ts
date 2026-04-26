import axios from "axios";

export const fetchEventDetails = (eventId: string) =>
  axios.get(`/api/reservation/event/${eventId}`);

export const applyPromo = (eventId: string, code: string) =>
  axios.post("/api/reservation/promo", { eventId, code });

export const makeReservation = (payload: {
  eventId: string;
  slotId: string;
  promoCodeId?: string;
  finalPrice: number;
}) => axios.post("/api/reservation/reserve", payload);

export const fetchMyReservations = () =>
  axios.get("/api/reservation/my");

export const cancelReservation = (reservationId: string) =>
  axios.patch(`/api/reservation/cancel/${reservationId}`);
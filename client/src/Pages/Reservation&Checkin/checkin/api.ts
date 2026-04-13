
import axios from "axios";

export const fetchEventCheckins = (eventId: string) =>
  axios.get(`/api/checkin/event/${eventId}`);

export const scanCheckin = (reservationCode: string) =>
  axios.post("/api/checkin/scan", { reservationCode });

export const searchEventGuests = (eventId: string, query: string) =>
  axios.get(`/api/checkin/search/${eventId}?query=${encodeURIComponent(query)}`);

export const manualCheckinByReservation = (reservationId: string) =>
  axios.post("/api/checkin/manual", { reservationId });
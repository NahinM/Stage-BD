import axios from "axios";
import { useUserStore } from "@/store/User/user";

const getUserId = () => useUserStore.getState().user?.id;

const withUser = () => ({
  params: {
    userId: getUserId(),
  },
});

export const fetchEventDetails = (eventId: string) =>
  axios.get(`/api/reservation/event/${eventId}`);

export const applyPromo = (eventId: string, code: string) =>
  axios.post("/api/reservation/promo", { eventId, code });

export const makeReservation = (payload: {
  eventId: string;
  slotId: string;
  promoCodeId?: string;
  finalPrice: number;
}) => {
  console.log("RESERVING AS USER:", getUserId());
  return axios.post("/api/reservation/reserve", payload, withUser());
};

export const fetchMyReservations = () => {
  console.log("FETCHING RESERVATIONS AS USER:", getUserId());
  return axios.get("/api/reservation/my", withUser());
};

export const cancelReservation = (reservationId: string) =>
  axios.patch(`/api/reservation/cancel/${reservationId}`, {}, withUser());
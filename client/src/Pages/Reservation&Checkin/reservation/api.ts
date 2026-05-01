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
  const userId = getUserId();
  console.log("RESERVE USER:", userId);

  return axios.post("/api/reservation/reserve", payload, {
    params: { userId },
  });
};

export const fetchMyReservations = () => {
  const userId = getUserId();
  console.log("FETCH USER:", userId);

  return axios.get("/api/reservation/my", {
    params: { userId },
  });
};

export const cancelReservation = (reservationId: string) => {
  const userId = getUserId();

  return axios.patch(
    `/api/reservation/cancel/${reservationId}`,
    {},
    { params: { userId } }
  );
};
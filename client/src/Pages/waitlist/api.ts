import axios from "axios";
import { useUserStore } from "@/store/User/user";

const getUserId = () => useUserStore.getState().user?.id;

export const joinWaitlist = (eventId: string) =>
  axios.post("/api/waitlist/join", { eventId }, { params: { userId: getUserId() } });

export const getWaitlistPosition = (eventId: string) =>
  axios.get(`/api/waitlist/position/${eventId}`, { params: { userId: getUserId() } });

export const getEventWaitlist = (eventId: string) =>
  axios.get(`/api/waitlist/event/${eventId}`);

export const cancelWaitlistEntry = (id: string) =>
  axios.delete(`/api/waitlist/cancel/${id}`);

export const getOrganizerEvents = () =>
  axios.get("/api/waitlist/organizer/events", { params: { userId: getUserId() } });
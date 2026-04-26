import axios from "axios";

export const fetchMyReservations = () =>
    axios.get("/api/reservation/my");

export const cancelReservation = (reservationId: string) =>
    axios.patch(`/api/reservation/cancel/${reservationId}`);
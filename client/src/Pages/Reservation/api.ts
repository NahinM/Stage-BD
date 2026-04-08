import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const requestReservation = async (reservationData: { username: string, event_id: number, promo_code?: string }) => {
    const res = await axios.post(`${API_URL}/reservations/book`, reservationData);
    return res.data;
}

export const joinWaitlist = async (data: { username: string, event_id: number }) => {
    const res = await axios.post(`${API_URL}/reservations/waitlist`, data);
    return res.data;
}

export const cancelReservation = async (reservation_id: number, event_id: number) => {
    const res = await axios.post(`${API_URL}/reservations/cancel`, { reservation_id, event_id });
    return res.data;
}

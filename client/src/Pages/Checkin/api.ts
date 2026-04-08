import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const verifyCheckIn = async (qr_code_string: string) => {
    const res = await axios.post(`${API_URL}/checkin/verify`, { qr_code_string });
    return res.data;
}

export const getDashboardStats = async (eventId: number) => {
    const res = await axios.get(`${API_URL}/checkin/dashboard/${eventId}`);
    return res.data;
}

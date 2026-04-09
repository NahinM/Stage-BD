import { type EventDetails } from "./event-detail-type";
import axios from "axios";

export const fetchEventDetails = async (id: string) => {
    const response = await axios.get<EventDetails>(`/api/events/${id}`);
    return response.data;
}
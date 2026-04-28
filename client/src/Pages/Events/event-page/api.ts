import { type EventDetails, type Venue } from "./event-detail-type";
import axios from "axios";

export const fetchEventDetails = async (id: string) => {
    const response = await axios.get<EventDetails[]>(`/api/event`, { params: { query: JSON.stringify({ id: id }) } });
    return response.data;
};

export const fetchVenueDetails = async (venueId: string) => {
    const response = await axios.get<Venue[]>(`/api/event/venue`, { params: { venueID: venueId } });
    return response.data;
};
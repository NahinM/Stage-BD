import axios from "axios";

export const updateEventDetails = async (
    event_id: string,
    eventData: any
) => {
    const response = await axios.put(`/api/event`, {
        id: event_id,
        event: eventData,
    }).catch((error) => {
        console.error("Error updating event:", error);
        throw error;
    });
    return response.data;
};

export const updateVenueDetails = async (
    venue_id: string,
    venueData: any
) => {
    const response = await axios.put(`/api/event/venue`, {
        id: venue_id,
        venue: venueData,
    }).catch((error) => {
        console.error("Error updating venue:", error);
        throw error;
    });
    return response.data;
};

export const getEventDetails = async (event_id: string) => {
    const response = await axios.get(`/api/event`, { params: { query: JSON.stringify({ id: event_id }) } }).catch((error) => {
        console.error("Error fetching event details:", error);
        throw error;
    });
    return response.data;
};

export const getVenueDetails = async (venue_id: string) => {
    const response = await axios.get(`/api/event/venue`, { params: { venueID: venue_id } }).catch((error) => {
        console.error("Error fetching venue details:", error);
        throw error;
    });
    return response.data;
};
import api from "@/authentication/public-api";

export const updateEventDetails = async (
    event_id: string,
    eventData: any
) => {
    const response = await api.put(`/event`, {
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
    const response = await api.put(`/event/venue`, {
        id: venue_id,
        venue: venueData,
    }).catch((error) => {
        console.error("Error updating venue:", error);
        throw error;
    });
    return response.data;
};

export const getEventDetails = async (event_id: string) => {
    const response = await api.get(`/event`, { params: { query: JSON.stringify({ id: event_id }) } }).catch((error) => {
        console.error("Error fetching event details:", error);
        throw error;
    });
    return response.data;
};

export const getVenueDetails = async (venue_id: string) => {
    const response = await api.get(`/event/venue`, { params: { venueID: venue_id } }).catch((error) => {
        console.error("Error fetching venue details:", error);
        throw error;
    });
    return response.data;
};

export const deleteEvent = async (event_id: string) => {
    if (!event_id) {
        throw new Error("Event ID is required for deletion");
    }
    const response = await api.delete(`/event`, { data: { id: event_id } }).catch((error) => {
        console.error("Error deleting event:", error);
        throw error;
    });
    return response.data;
};

export const deleteVenue = async (venue_id: string) => {
    if (!venue_id) {
        throw new Error("Venue ID is required for deletion");
    }
    const response = await api.delete(`/event/venue`, { data: { id: venue_id } }).catch((error) => {
        console.error("Error deleting venue:", error);
        throw error;
    });
    return response.data;
};
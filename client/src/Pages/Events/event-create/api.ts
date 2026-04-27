import axios from "axios";
import { type EventCreateData, type CreateVenueData } from "./data-section";

export const createEvent = async (eventData: EventCreateData, venueData: CreateVenueData) => {
    const response = await axios.post("/api/event", {
        event: eventData,
        venue: venueData,
    }).catch((error) => {
        console.error("Error creating event:", error);
        throw error;
    });
    return response.data;
};
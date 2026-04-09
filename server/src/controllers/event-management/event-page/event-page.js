import { db_getEventDetails, db_getVenue, db_getCategoryName } from "../../../models/event-management/event-page/event-page.js";

export const getEventDetails = async (req, res) => {
    const eventId = req.params.id;
    console.log(`Received request for event details with id: ${eventId}`);
    try {
        const eventDetails = await db_getEventDetails(eventId);
        const categoryName = await db_getCategoryName(eventDetails.category_id);
        const venueDetails = await db_getVenue(eventDetails.venue_id);
        eventDetails.category = categoryName;
        eventDetails.venue = venueDetails;
        delete eventDetails.category_id;
        delete eventDetails.venue_id;
        eventDetails.venue = venueDetails;
        eventDetails.category = categoryName;
        res.json(eventDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
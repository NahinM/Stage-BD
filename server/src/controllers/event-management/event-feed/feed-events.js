import { db_getEvents } from "../../../models/event-management/event-feed/event-feed.js";

export const getEvents = async (req, res) => {
    try {
        const events = await db_getEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
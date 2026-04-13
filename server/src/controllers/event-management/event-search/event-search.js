import { db_searchEvents } from "../../../models/event-management/event-search/event-search.js";

export const searchEvents = (req, res) => {
    const { search, filter } = req.body;
    db_searchEvents(search, filter)
      .then((events) => {
        res.json(events);
      })
      .catch((error) => {
        console.error('Error searching events:', error);
        res.status(500).json({ error: 'Failed to search events' });
      });
}
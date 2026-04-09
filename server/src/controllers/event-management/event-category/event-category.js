import { db_getEventCategories } from "../../../models/event-management/event-category/event-category.js"

export const getEventCategories = (req, res) => {
    const categories = db_getEventCategories()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch event categories' });
        });
}
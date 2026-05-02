import * as eventReviewsModel from '../../models/engagement/event-reviews.js';

export const fetchEventReviews = async (req, res) => {
    const { event_id } = req.params;
    try {
        const data = await eventReviewsModel.getReviewsByEventId(event_id);
        res.status(200).send({ message: "Event reviews fetched successfully.", data });
    } catch (err) {
        console.error("Error fetching event reviews:", err);
        res.status(500).send({ message: "Failed to fetch event reviews.", error: err.message });
    }
};

export const postEventReview = async (req, res) => {
    const { event_id } = req.params;
    const { user_id, review } = req.body;

    if (!user_id || !review) {
        return res.status(400).send({ message: "user_id and review are required." });
    }

    try {
        const data = await eventReviewsModel.addEventReview(event_id, user_id, review);
        res.status(201).send({ message: "Event review posted successfully.", data });
    } catch (err) {
        console.error("Error posting event review:", err);
        res.status(500).send({ message: "Failed to post event review.", error: err.message });
    }
};

import * as reviewsModel from '../../models/engagement/reviews.js';

export const postReview = async (req, res) => {
    try {
        const data = await reviewsModel.addReview(req.body);
        res.status(201).send({ message: "Review posted.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to post review." });
    }
};

export const editReview = async (req, res) => {
    const { id } = req.params;
    const { review_text } = req.body;
    try {
        const data = await reviewsModel.updateReview(id, review_text);
        res.status(200).send({ message: "Review updated.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to update review." });
    }
};

export const getReviews = async (req, res) => {
    const { event_id } = req.params;
    try {
        const data = await reviewsModel.getEventReviews(event_id);
        res.status(200).send({ message: "Reviews fetched.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch reviews." });
    }
};

export const voteReview = async (req, res) => {
    const { id } = req.params;
    const { voter_id, vote_type } = req.body;
    try {
        const data = await reviewsModel.voteOnReview(id, voter_id, vote_type);
        res.status(200).send({ message: "Vote cast.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to cast vote." });
    }
};

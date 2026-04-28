import * as reviewsModel from '../../models/engagement/reviews.js';

export const postReview = async (req, res) => {
    const { event_id, reviewer_id, parent_id, rating, review_text } = req.body;
    
    try {
        // 1. Verify Attendance
        const hasAttended = await reviewsModel.hasAttendedEvent(reviewer_id, event_id);
        if (!hasAttended) {
            return res.status(403).send({ message: "You must attend the event to leave a review." });
        }

        // 2. Check 5 Review Limit
        const reviewCount = await reviewsModel.getReviewCountForUser(reviewer_id, event_id);
        if (reviewCount >= 5) {
            return res.status(403).send({ message: "You have reached the limit of 5 reviews/replies for this event." });
        }

        // 3. Create Review
        const data = await reviewsModel.createReview({
            event_id,
            reviewer_id,
            parent_id: parent_id || null,
            rating: parent_id ? null : rating, // Replies don't have distinct ratings
            review_text
        });

        res.status(201).send({ message: "Review posted successfully.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to post review." });
    }
};

export const editReview = async (req, res) => {
    const { id } = req.params;
    const { reviewer_id, review_text } = req.body;
    try {
        const data = await reviewsModel.updateReview(id, reviewer_id, review_text);
        res.status(200).send({ message: "Review updated.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to update review." });
    }
};

export const getReviews = async (req, res) => {
    const { event_id } = req.params;
    try {
        const data = await reviewsModel.getReviews(event_id);
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch reviews." });
    }
};

export const voteReview = async (req, res) => {
    const { id } = req.params;
    const { voter_id, vote_type } = req.body; 
    
    if (![1, -1].includes(vote_type)) {
        return res.status(400).send({ message: "vote_type must be 1 or -1" });
    }

    try {
        const data = await reviewsModel.castReviewVote(id, voter_id, vote_type);
        res.status(200).send({ message: "Vote cast successfully.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to cast vote." });
    }
};

import * as recommendationsModel from '../../models/engagement/recommendations.js';

export const getSmartRecommendations = async (req, res) => {
    const { user_id } = req.params;
    
    try {
        const recommendations = await recommendationsModel.getRecommendations(user_id);
        res.status(200).send({ message: "Recommendations fetched successfully.", data: recommendations });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch recommendations." });
    }
};

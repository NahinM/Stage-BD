import * as artistModel from '../../models/engagement/artist.js';

export const castArtistVote = async (req, res) => {
    const { artist_id } = req.params;
    const { voter_id, vote_type } = req.body;

    if (!voter_id || ![1, -1].includes(vote_type)) {
        return res.status(400).send({ message: "Invalid vote parameters. Requires voter_id and vote_type (1 or -1)." });
    }

    try {
        await artistModel.castVote(artist_id, voter_id, vote_type);
        const newScore = await artistModel.getScore(artist_id);
        res.status(200).send({ message: "Vote cast successfully.", score: newScore });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to cast vote." });
    }
};

export const getArtistScore = async (req, res) => {
    const { artist_id } = req.params;
    try {
        const score = await artistModel.getScore(artist_id);
        res.status(200).send({ message: "Score fetched successfully.", score });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch score." });
    }
};

import * as artistModel from '../../models/engagement/artist.js';

export const getArtistVoteStatus = async (req, res) => {
    const { artist_id } = req.params;
    const { voter_id } = req.query;

    if (!voter_id) return res.json({ vote_type: null });

    try {
        const { vote_type } = await artistModel.getVoteStatus(artist_id, voter_id);
        res.json({ vote_type });
    } catch (error) {
        console.error("Error fetching vote status", error);
        res.status(500).json({ error: error.message });
    }
};

export const castArtistVote = async (req, res) => {
    const { artist_id } = req.params;
    const { voter_id, vote_type } = req.body;

    if (!voter_id || voter_id === "00000000-0000-0000-0000-000000000000" || !["UP", "DOWN", "NONE"].includes(vote_type)) {
        return res.status(401).send({ message: "You must be logged in to vote." });
    }

    try {
        await artistModel.castVote(artist_id, voter_id, vote_type);
        const newScore = await artistModel.getScore(artist_id);
        res.status(200).send({ message: "Vote cast successfully.", score: newScore });
    } catch (err) {
        console.error(err);
        if (err.message === "you already liked the artist" || err.message === "you already disliked the artist") {
            return res.status(400).send({ message: err.message });
        }
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
export const getArtistProfile = async (req, res) => {
    const { artist_id } = req.params;
    try {
        const data = await artistModel.getArtistDetails(artist_id);
        res.status(200).send({ message: "Artist profile fetched.", data });
    } catch (err) {
        if (err.code === 'PGRST116') {
            return res.status(404).send({ message: "Artist not found." });
        }
        console.error(err);
        res.status(500).send({ message: "Failed to fetch artist profile." });
    }
};

export const getArtistEvents = async (req, res) => {
    const { artist_id } = req.params;
    try {
        const data = await artistModel.getArtistEvents(artist_id);
        res.status(200).send({ message: "Artist events fetched.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch artist events." });
    }
};

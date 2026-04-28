import * as contestsModel from '../../models/engagement/contests.js';

export const submitEntry = async (req, res) => {
    const { contest_id, user_id, content_url, description } = req.body;
    try {
        const data = await contestsModel.addContestEntry({ contest_id, user_id, content_url, description });
        res.status(201).send({ message: "Entry submitted.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to submit entry." });
    }
};

export const getLeaderboard = async (req, res) => {
    const { contest_id } = req.params;
    try {
        const data = await contestsModel.getContestLeaderboard(contest_id);
        res.status(200).send({ message: "Leaderboard fetched.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch leaderboard." });
    }
};

export const voteEntry = async (req, res) => {
    const { entry_id } = req.params;
    const { voter_id, vote_type } = req.body;
    if (![1, -1].includes(vote_type)) {
        return res.status(400).send({ message: "vote_type must be 1 or -1" });
    }
    
    try {
        const data = await contestsModel.castVote(entry_id, voter_id, vote_type);
        res.status(200).send({ message: "Vote cast successfully.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to cast vote." });
    }
};
export const getContests = async (req, res) => {
    try {
        const data = await contestsModel.getAllContests();
        res.status(200).send({ message: "Contests fetched.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch contests." });
    }
};

export const getContestById = async (req, res) => {
    const { contest_id } = req.params;
    try {
        const data = await contestsModel.getContest(contest_id);
        res.status(200).send({ message: "Contest fetched.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch contest." });
    }
};

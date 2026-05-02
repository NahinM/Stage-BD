import * as contestsModel from '../../models/engagement/contests.js';


export const createContest = async (req, res) => {
    const { title, venue, ending_time, prize_giving_time, organizer_id, rules } = req.body;

    if (!title || !venue || !organizer_id) {
        return res.status(400).send({ message: "Missing required fields." });
    }

    try {
        const data = await contestsModel.createContest({ title, venue, ending_time, prize_giving_time, organizer_id, rules });
        res.status(201).send({ message: "Contest created successfully.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to create contest." });
    }
};

export const submitEntry = async (req, res) => {
    const { contest_id, user_id, content_url, description } = req.body;
    try {
        const data = await contestsModel.addContestEntry({ contest_id, user_id, content_url, description });
        res.status(201).send({ message: "Entry submitted.", data });
    } catch (err) {
        console.error(err);
        if (err.message === "You have already submitted an entry for this contest.") {
            return res.status(400).send({ message: err.message });
        }
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

    if (!voter_id || voter_id === "00000000-0000-0000-0000-000000000000" || !["UP", "DOWN", "NONE"].includes(vote_type)) {
        return res.status(401).send({ message: "You must be logged in to vote with valid vote type (UP or DOWN)." });
    }

    try {
        const data = await contestsModel.castVote(entry_id, voter_id, vote_type);
        res.status(200).send({ message: "Vote cast successfully.", data });
    } catch (err) {
        console.error(err);
        if (err.message === "you already liked the participator" || err.message === "you already disliked the participator") {
            return res.status(400).send({ message: err.message });
        }
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
        if (err.code === 'PGRST116') {
            return res.status(404).send({ message: "Contest not found." });
        }
        console.error(err);
        res.status(500).send({ message: "Failed to fetch contest." });
    }
};

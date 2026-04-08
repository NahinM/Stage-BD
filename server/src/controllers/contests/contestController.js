import * as contestModel from "../../models/contests/contest.js";
import * as voteModel from "../../models/contests/votes.js";

export const fetchContests = async (req, res) => {
    try {
        const contests = await contestModel.getContests();
        res.status(200).json({ list: contests });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const fetchContestDetails = async (req, res) => {
    const { contest_id } = req.params;
    try {
        const contest = await contestModel.getContestById(contest_id);
        const entries = await contestModel.getEntriesByContest(contest_id);
        const votes = await voteModel.getVotesForContest(contest_id);
        
        // Count votes per entry
        const voteCounts = {};
        votes.forEach(v => {
            voteCounts[v.entry_id] = (voteCounts[v.entry_id] || 0) + 1;
        });

        const mappedEntries = entries.map(e => ({
            ...e,
            votes: voteCounts[e.entry_id] || 0
        })).sort((a,b) => b.votes - a.votes); // Sort leaderboard

        res.status(200).json({ contest, entries: mappedEntries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const submitToContest = async (req, res) => {
     try {
         const entry = await contestModel.submitEntry(req.body);
         res.status(200).json({ success: true, entry });
     } catch(err) {
         res.status(400).json({ error: err.message });
     }
}

export const castVote = async (req, res) => {
    const { entry_id, contest_id, username } = req.body;
    try {
         await voteModel.addVote({ entry_id, contest_id, username });
         res.status(200).json({ success: true, message: "Vote counted!" });
    } catch(err) {
         res.status(400).json({ error: err.message }); // Unique constraint will throw if duplicate
    }
}

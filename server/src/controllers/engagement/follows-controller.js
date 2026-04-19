import * as followsModel from '../../models/engagement/follows.js';

export const followUser = async (req, res) => {
    const { follower_id, followed_id } = req.body;
    if (follower_id === followed_id) {
        return res.status(400).send({ message: "You cannot follow yourself." });
    }
    
    try {
        const { data, error } = await followsModel.followUser(follower_id, followed_id);
        if (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(400).send({ message: "Already following." });
            }
            throw error;
        }
        res.status(201).send({ message: "Successfully followed.", data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to follow user." });
    }
};

export const unfollowUser = async (req, res) => {
    const { follower_id, followed_id } = req.body;
    try {
        const { error } = await followsModel.unfollowUser(follower_id, followed_id);
        if (error) throw error;
        res.status(200).send({ message: "Successfully unfollowed." });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to unfollow user." });
    }
};

export const getFollowers = async (req, res) => {
    const { user_id } = req.params;
    try {
        const { data, error } = await followsModel.getFollowers(user_id);
        if (error) throw error;
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to load followers." });
    }
};

export const getFollowing = async (req, res) => {
    const { user_id } = req.params;
    try {
        const { data, error } = await followsModel.getFollowing(user_id);
        if (error) throw error;
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to load following." });
    }
};

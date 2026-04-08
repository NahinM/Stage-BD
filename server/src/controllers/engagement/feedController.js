import * as feedModel from "../../models/engagement/feed.js";
import * as followerModel from "../../models/engagement/followers.js";

export const getFeed = async (req, res) => {
    const { username } = req.params;
    try {
        const events = await feedModel.getPersonalizedFeed(username);
        res.status(200).json({ success: true, events });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const followAction = async (req, res) => {
    const { follower, followed, action } = req.body; // action: 'follow' | 'unfollow'
    try {
        if (action === 'follow') {
            await followerModel.followUser(follower, followed);
        } else {
            await followerModel.unfollowUser(follower, followed);
        }
        res.status(200).json({ success: true, action });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const getFollowStats = async (req, res) => {
    const { username } = req.params;
    try {
        const followers = await followerModel.getFollowers(username);
        const following = await followerModel.getFollowing(username);
        res.status(200).json({ followers: followers.length, following: following.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

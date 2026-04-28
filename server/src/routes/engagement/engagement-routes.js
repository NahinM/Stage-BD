import { app } from "../../config/config.js";
import { postReview, editReview, getReviews, voteReview } from "../../controllers/engagement/reviews-controller.js";
import { followUser, unfollowUser, getFollowers, getFollowing, getFollowerCount, checkFollowStatus } from "../../controllers/engagement/follows-controller.js";
import { getSmartRecommendations } from "../../controllers/engagement/recommendations-controller.js";
import { submitEntry, getLeaderboard, voteEntry, getContests, getContestById } from "../../controllers/engagement/contests-controller.js";
import { castArtistVote, getArtistScore, getArtistProfile, getArtistEvents } from "../../controllers/engagement/artist-controller.js";

// Artist Profile & Voting
app.get('/api/artist/:artist_id/profile', getArtistProfile);
app.get('/api/artist/:artist_id/events', getArtistEvents);
app.post('/api/artist/:artist_id/vote', castArtistVote);
app.get('/api/artist/:artist_id/score', getArtistScore);

// Reviews
app.post('/api/reviews', postReview);
app.put('/api/reviews/:id', editReview);
app.get('/api/reviews/event/:event_id', getReviews);
app.post('/api/reviews/:id/vote', voteReview);

// Follows
app.post('/api/follows', followUser);
app.delete('/api/follows', unfollowUser);
app.get('/api/users/:user_id/followers', getFollowers);
app.get('/api/users/:user_id/following', getFollowing);
app.get('/api/users/:user_id/followers/count', getFollowerCount);
app.get('/api/follows/status', checkFollowStatus);

// Recommendations
app.get('/api/recommendations/:user_id', getSmartRecommendations);

// Contests
app.get('/api/contests', getContests);
app.get('/api/contests/:contest_id', getContestById);
app.post('/api/contests/entry', submitEntry);
app.get('/api/contests/:contest_id/leaderboard', getLeaderboard);
app.post('/api/contests/entry/:entry_id/vote', voteEntry);

import { app } from "../../config/config.js";
import { postReview, editReview, getReviews, voteReview } from "../../controllers/engagement/reviews-controller.js";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../../controllers/engagement/follows-controller.js";
import { getSmartRecommendations } from "../../controllers/engagement/recommendations-controller.js";
import { submitEntry, getLeaderboard, voteEntry } from "../../controllers/engagement/contests-controller.js";
import { castArtistVote, getArtistScore } from "../../controllers/engagement/artist-controller.js";

// Artist Voting
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

// Recommendations
app.get('/api/recommendations/:user_id', getSmartRecommendations);

// Contests
app.post('/api/contests/entry', submitEntry);
app.get('/api/contests/:contest_id/leaderboard', getLeaderboard);
app.post('/api/contests/entry/:entry_id/vote', voteEntry);

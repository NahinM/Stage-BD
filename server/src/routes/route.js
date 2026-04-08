import * as controller from "../controllers/controller.js";
import { app } from "../config/config.js";

app.get('/api/hello', controller.helloController.getHello);
app.post('/api/signin', controller.signInController.signIn);
app.post('/api/signup', controller.signUpController.signUp);

app.post('/api/reservations/book', controller.reservationController.bookReservation);
app.post('/api/reservations/cancel', controller.reservationController.cancelReservation);
app.post('/api/reservations/waitlist', controller.reservationController.joinWaitlist);
app.get('/api/reservations/user/:username', controller.reservationController.getUserReservations);

app.post('/api/checkin/verify', controller.checkinController.verifyCheckIn);
app.get('/api/checkin/dashboard/:eventId', controller.checkinController.getDashboardStats);

// Member 3 Routes
app.post('/api/reviews', controller.reviewController.submitReview);
app.get('/api/reviews/:eventId', controller.reviewController.getEventReviews);
app.delete('/api/reviews', controller.reviewController.deleteReview);

app.get('/api/feed/:username', controller.feedController.getFeed);
app.post('/api/follow', controller.feedController.followAction);
app.get('/api/follow/:username', controller.feedController.getFollowStats);

app.get('/api/artist/:username', controller.artistController.getArtistProfile);
app.post('/api/artist', controller.artistController.setupProfile);
app.post('/api/artist/media', controller.artistController.addMedia);

app.get('/api/contests', controller.contestController.fetchContests);
app.get('/api/contests/:contest_id', controller.contestController.fetchContestDetails);
app.post('/api/contests/entry', controller.contestController.submitToContest);
app.post('/api/contests/vote', controller.contestController.castVote);

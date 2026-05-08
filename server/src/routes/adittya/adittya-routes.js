import { app } from '../../config/config.js'
import * as controller from '../../controllers/controller.js';

/* Adittya artist feature routes */
app.get("/api/adittya/artists", controller.adittyaArtistController.getArtists);
app.get("/api/adittya/artists/:username", controller.adittyaArtistController.getArtistDetails);
app.get("/api/adittya/showcase", controller.adittyaArtistController.getShowcase);
app.post("/api/adittya/profile", controller.adittyaArtistController.saveArtistProfile);
app.post("/api/adittya/media", controller.adittyaArtistController.createArtistMedia);
app.put("/api/adittya/media/:mediaId", controller.adittyaArtistController.editArtistMedia);
app.post("/api/adittya/follow", controller.adittyaArtistController.createFollow);
app.get("/api/adittya/campaigns", controller.adittyaArtistController.getCampaigns);
app.post("/api/adittya/contributions", controller.adittyaArtistController.saveContribution);
app.get("/api/adittya/analytics", controller.adittyaArtistController.getEventAnalytics);

app.get(
  "/api/adittya/artist-profile-status/:username",
  controller.adittyaArtistController.getArtistProfileStatus
);

app.post(
  "/api/adittya/artist-profile",
  controller.adittyaArtistController.createArtistProfile
);

app.put(
  "/api/adittya/artist-cover",
  controller.adittyaArtistController.updateArtistCoverImage
);

app.post(
  "/api/adittya/campaigns",
  controller.adittyaArtistController.createCampaignForArtist
);

/* Adittya sponsor / patron routes */
app.get(
  "/api/adittya/public-sponsors",
  controller.adittyaArtistController.getPublicSponsorProfiles
);

app.get(
  "/api/adittya/my-sponsor-profile/:username",
  controller.adittyaArtistController.getMySponsorProfile
);

app.put(
  "/api/adittya/my-sponsor-profile",
  controller.adittyaArtistController.upsertMySponsorProfile
);

app.post(
  "/api/adittya/sponsorship-request",
  controller.adittyaArtistController.createSponsorshipRequest
);

app.get(
  "/api/adittya/sponsorship-request/:username",
  controller.adittyaArtistController.getSponsorshipRequestsByArtist
);

app.get(
  "/api/adittya/sponsor-requests/:username",
  controller.adittyaArtistController.getSponsorshipRequestsForSponsor
);

app.patch(
  "/api/adittya/sponsorship-request/:requestId/status",
  controller.adittyaArtistController.updateSponsorshipRequestStatus
);

app.get(
  "/api/adittya/sponsor-artists/:sponsorUsername",
  controller.adittyaArtistController.getAvailableArtistsForSponsor
);

app.post(
  "/api/adittya/sponsor-offer",
  controller.adittyaArtistController.createSponsorOffer
);

app.patch(
  "/api/adittya/sponsor-offer/:requestId/respond",
  controller.adittyaArtistController.updateSponsorOfferByArtist
);
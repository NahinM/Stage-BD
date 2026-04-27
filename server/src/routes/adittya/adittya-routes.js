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
/* Adittya sponsor request routes */
app.post("/api/adittya/sponsorship-request", controller.adittyaArtistController.createSponsorshipRequest);
app.get("/api/adittya/sponsorship-request/:username", controller.adittyaArtistController.getSponsorshipRequestsByArtist);
import { app } from '../../config/config.js'
/* Adittya artist feature routes */
app.get("/api/adittya/artists", controller.adittyaArtistController.getArtists);
app.get("/api/adittya/artists/:username", controller.adittyaArtistController.getArtistDetails);
app.get("/api/adittya/showcase", controller.adittyaArtistController.getShowcase);
app.post("/api/adittya/profile", controller.adittyaArtistController.saveArtistProfile);
app.post("/api/adittya/media", controller.adittyaArtistController.createArtistMedia);
app.put("/api/adittya/media/:mediaId", controller.adittyaArtistController.editArtistMedia);
app.post("/api/adittya/follow", controller.adittyaArtistController.createFollow);
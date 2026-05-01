import { app } from "../../config/config.js";
import { RAC } from "../../controllers/controller.js";
app.post("/api/waitlist/join", RAC.waitlist.joinWaitlistController);
app.get("/api/waitlist/position/:eventId", RAC.waitlist.getUserPositionController);
app.get("/api/waitlist/event/:eventId", RAC.waitlist.getEventWaitlistController);
app.delete("/api/waitlist/cancel/:id", RAC.waitlist.cancelWaitlistController);
app.get("/api/waitlist/organizer/events", RAC.waitlist.getOrganizerEventsController);
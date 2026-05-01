import { app } from "../../config/config.js";
import { EventController } from "../../controllers/controller.js";
import { EventModel } from "../../models/event-management/event-model.js";

app.get("/api/event", EventController.getEvent);
app.put("/api/event", EventController.updateEvent);
app.post("/api/event", EventController.createEvent);
app.get("/api/event/categories", EventController.getCategories);
app.get("/api/event/venue", EventController.getVenue);
app.put("/api/event/venue", EventController.updateVenue);

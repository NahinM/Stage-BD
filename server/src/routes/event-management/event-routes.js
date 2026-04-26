import { app } from "../../config/config.js";
import { EventController } from "../../controllers/controller.js";
import { EventModel } from "../../models/event-management/event-model.js";

app.get("/api/event", EventController.getEvent);
app.get("/api/event/categories", EventController.getCategories);
app.get("/api/event/venue", EventController.getVenue);

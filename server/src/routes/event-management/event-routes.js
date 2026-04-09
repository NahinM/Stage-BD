import { app } from "../../config/config.js";
import { eventController } from "../../controllers/controller.js";

app.get("/api/events", eventController.feed.getEvents);
app.get("/api/events/:id", eventController.page.getEventDetails);
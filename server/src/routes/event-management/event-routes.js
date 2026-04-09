import { app } from "../../config/config.js";
import { eventController } from "../../controllers/controller.js";

app.get("/api/events", eventController.feed.getEvents);
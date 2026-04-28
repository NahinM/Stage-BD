import { app } from "../../config/config.js";
import { UserController } from "../../controllers/controller.js";

app.get("/api/user/search", UserController.search);
app.get("/api/user/role", UserController.role);
app.get("/api/user/refresh", UserController.refresh);

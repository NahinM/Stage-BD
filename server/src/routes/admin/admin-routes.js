import { app } from "../../config/config.js";
import { UserController } from "../../controllers/controller.js";

app.get("/api/admin/users", UserController.getAll);

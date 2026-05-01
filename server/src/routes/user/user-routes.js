import { app } from "../../config/config.js";
import { UserController } from "../../controllers/controller.js";

app.get("/api/user", UserController.get);
app.put("/api/user", UserController.update);

app.get("/api/user/search", UserController.search);
app.get("/api/user/role", UserController.role);
app.get("/api/user/refreshToken", UserController.refreshAccessToken);
app.post("/api/user/logout", UserController.logout);

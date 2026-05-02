import { app } from "../../config/config.js";
import { UserController } from "../../controllers/controller.js";

app.get("/api/user", UserController.get);
app.put("/api/user", UserController.update);

app.get("/api/user/search", UserController.search);
app.get("/api/user/role", UserController.role);
app.post("/api/user/role", UserController.addRole);
app.delete("/api/user/role", UserController.deleteRole);
app.get("/api/user/refreshToken", UserController.refreshAccessToken);
app.post("/api/user/logout", UserController.logout);

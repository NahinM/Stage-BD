import { app } from "../../config/config.js";
import { userController } from "../../controllers/controller.js";

app.get('/api/user/info', userController.user.getUserByInfo);
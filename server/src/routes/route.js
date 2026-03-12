import * as controller from "../controllers/controller.js";
import { app } from "../config/config.js";

app.get('/api/hello', controller.helloController.getHello);
app.post('/api/signin', controller.signInController.signIn);

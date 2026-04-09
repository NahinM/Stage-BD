import * as controller from "../controllers/controller.js";
import { app } from "../config/config.js";
import './event-management/event-routes.js';

app.get('/api/hello', controller.helloController.getHello);
app.post('/api/signin', controller.signInController.signIn);
app.post('/api/signup', controller.signUpController.signUp);

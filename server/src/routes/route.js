import * as controller from "../controllers/controller.js";
import { app } from "../config/config.js";
import './adittya/adittya-routes.js';
import './event-management/event-routes.js';
import './reservation&checkin/reservation&checkin.-routes.js';
import './user/user-routes.js';
import './engagement/engagement-routes.js';  // New Engagement & Rewards Module
app.get('/api/hello', controller.helloController.getHello);
app.post('/api/signin', controller.signInController.signIn);
app.post('/api/signup', controller.signUpController.signUp);



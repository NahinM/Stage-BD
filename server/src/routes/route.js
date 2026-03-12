import { getHello } from "../controllers/controller.js";

import { app } from "../config/config.js";

app.get('/api/hello', getHello);

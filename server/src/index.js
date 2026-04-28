import { app } from "./config/config.js";
import "./middlewares/middleware.js";
import "./routes/route.js";
import { port } from "./config/env-variables.js";

app.listen(port, () => {
  console.log(`Local: http://localhost:${port}`);
  console.log(`Server is running on port ${port}`);
});

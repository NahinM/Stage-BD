import { app, port } from "./config/config.js";
import './middlewares/middleware.js';
import './routes/route.js';

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
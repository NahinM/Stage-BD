import { app } from "./config/config.js";
import './middlewares/middleware.js';
import './routes/route.js';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
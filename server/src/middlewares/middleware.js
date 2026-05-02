import { app, cors, express, cookieParser } from "../config/config.js";

app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend URL
    credentials: true, // allow cookies to be sent
  }),
);
app.use(express.json());
app.use(cookieParser());

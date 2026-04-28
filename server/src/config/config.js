import express from "express";
import cors from "cors";
import sesstion from "express-session";
import cookieParser from "cookie-parser";
export const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend URL
    credentials: true, // allow cookies to be sent
  }),
);
export { cors, express, sesstion };

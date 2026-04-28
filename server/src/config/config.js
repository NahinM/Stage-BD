import express from "express";
import cors from "cors";
import sesstion from "express-session";
import cookieParser from "cookie-parser";
app.use(cookieParser());
export const app = express();
export { cors, express, sesstion };

import express from "express";
import cors from "cors";
import sesstion from "express-session";
import cookieParser from "cookie-parser";
const app = express();

export { app, cors, express, sesstion, cookieParser };

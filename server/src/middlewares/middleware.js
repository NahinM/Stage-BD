import { app, cors, express } from "../config/config.js";
import dotenv from 'dotenv';
dotenv.config({
    path: '../.env',
    debug: true
});
app.use(cors());
app.use(express.json());
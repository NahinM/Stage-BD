import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sesstion from 'express-session';
dotenv.config({path: './.env',quiet: true});

const port = process.env.PORT || 3000;
const zohoEmail = process.env.ZOHO_EMAIL;
const zohoAppPassword = process.env.ZOHO_APP_PASSWORD;
const sessionSecret = process.env.SESSION_SECRET;

export const app = express();
export {
    cors,
    express,
    sesstion,
    port,
    zohoEmail,
    zohoAppPassword,
    sessionSecret
};
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});

const port = process.env.PORT || 3000;
const zohoEmail = process.env.ZOHO_EMAIL;
const zohoAppPassword = process.env.ZOHO_APP_PASSWORD;

export const app = express();
export { cors, express, port, zohoEmail, zohoAppPassword };
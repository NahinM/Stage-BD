import dotenv from 'dotenv';
dotenv.config({path: './.env',quiet: true});

const port = process.env.PORT || 3000;
const zohoEmail = process.env.ZOHO_EMAIL;
const zohoAppPassword = process.env.ZOHO_APP_PASSWORD;
const sessionSecret = process.env.SESSION_SECRET;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export {
    port,
    zohoEmail,
    zohoAppPassword,
    sessionSecret,
    supabaseUrl,
    supabaseAnonKey
};
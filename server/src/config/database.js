import {
  supabaseUrl,
  supabaseAnonKey,
  supabaseConnectionString,
} from "./env-variables.js";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
// Initialize client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sql = postgres(supabaseConnectionString);

export { supabase, sql };

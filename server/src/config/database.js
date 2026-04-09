import { supabaseUrl, supabaseAnonKey } from './env-variables.js'
import { createClient } from '@supabase/supabase-js'

// Initialize client
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

export { supabase };
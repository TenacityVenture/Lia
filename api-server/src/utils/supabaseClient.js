// utils/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl, supabaseKey,
  {
    persistSession: true, // Persist session across requests
    autoRefreshToken: false, // Automatically refresh the token
    detectSessionInUrl: false, // Disable session detection in URL
  }
);

module.exports = supabase;

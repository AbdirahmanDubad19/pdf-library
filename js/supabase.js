// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = "https://YOUR_PROJECT_REF.supabase.co"; // replace with your Supabase URL
const supabaseKey = "YOUR_PUBLIC_ANON_KEY"; // replace with your anon public key
export const supabase = createClient(supabaseUrl, supabaseKey);



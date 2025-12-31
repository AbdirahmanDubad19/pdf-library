// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = "https://your-project-ref.supabase.co";
const supabaseKey = "your-public-anon-key"; // replace with your actual anon/public key
export const supabase = createClient(supabaseUrl, supabaseKey);


// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = "https://jjdcvwjfulyudbfbkdwx.supabase.co"; // replace with your Supabase URL
const supabaseKey = "sb_publishable_1zjYbj3nIeY0zAZQjiX3mw_1ELG3eyh"; // replace with your anon public key
export const supabase = createClient(supabaseUrl, supabaseKey);



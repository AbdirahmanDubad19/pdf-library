// js/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.31.0/dist/supabase.min.js";

// Your Supabase project info
const SUPABASE_URL = "https://jjdcvwjfulyudbfbkdwx.supabase.co";
const SUPABASE_KEY = "sb_publishable_1zjYbj3nIeY0zAZQjiX3mw_1ELG3eyh";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

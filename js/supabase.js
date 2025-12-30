console.log("supabase config loaded");

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://jjdcvwjfulyudbfbkdwx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1zjYbj3nIeY0zAZQjiX3mw_1ELG3eyh";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


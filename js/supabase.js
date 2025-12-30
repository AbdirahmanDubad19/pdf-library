import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// TODO: Replace these with your Supabase project values before testing.
const SUPABASE_URL = 'REPLACE_WITH_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'REPLACE_WITH_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function initAuthListener(onUser) {
  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null;
    if (typeof onUser === 'function') onUser(user);
  });
}

export async function signInWithOtp(email) {
  return supabase.auth.signInWithOtp({ email });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

import { initAuthListener, signInWithOtp, getCurrentUser, signOut } from './supabase.js';

function qs(sel) { return document.querySelector(sel); }

async function updateUserUI(user) {
  const lastEl = qs('#last-signin');
  const userEl = qs('#user-email');
  if (!user) {
    lastEl.textContent = 'Not signed in';
    userEl.textContent = '';
    qs('#btn-signout').style.display = 'none';
    qs('#login-form').style.display = 'block';
    return;
  }

  userEl.textContent = user.email ?? '';
  // Supabase user may have `last_sign_in_at` or `identities` metadata depending on RLS/version.
  lastEl.textContent = user?.last_sign_in_at ?? 'Unknown';
  qs('#btn-signout').style.display = 'inline-block';
  qs('#login-form').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
  initAuthListener(updateUserUI);
  const current = await getCurrentUser();
  updateUserUI(current);

  qs('#btn-login').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = qs('#email').value.trim();
    if (!email) return alert('Enter an email');
    const { error } = await signInWithOtp(email);
    if (error) return alert(error.message || error.toString());
    alert('Magic link sent — check your email.');
  });

  qs('#btn-signout').addEventListener('click', async () => {
    await signOut();
  });
});

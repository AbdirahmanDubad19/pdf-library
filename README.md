PDF Library — quick notes

1) Fill your Supabase project values in `js/supabase.js`: replace `REPLACE_WITH_SUPABASE_URL` and `REPLACE_WITH_SUPABASE_ANON_KEY`.

2) Enable GitHub Pages for this repository (Settings → Pages → Branch: `main`, Folder: `/ (root)`).

3) Visit `https://<your-username>.github.io/<repo>/admin.html` to open the admin page.

4) Enter an email and request a magic link. After signing in via the magic link, the admin page will show the user's email and the `last_sign_in` value.

Notes: The page uses the Supabase JS ESM CDN and expects a public (anon) key; you'll need to allow redirects/magic-link settings in your Supabase project.
# pdf-library
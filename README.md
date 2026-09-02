# Tobio Sushi — demo site

Next.js 16 (App Router, TypeScript, Tailwind v4) frontend backed by a local
[PocketBase](https://pocketbase.io) instance for content (menu, locations,
testimonials, roll-builder options, site settings).

## Running locally

Two processes, both local:

```bash
# 1. Backend — PocketBase (DB + auth + admin UI), from the project root
cd pocketbase && ./pocketbase serve --http=127.0.0.1:8090

# 2. Frontend — Next.js, in a second terminal, from the project root
npm run dev
```

- Site: http://localhost:3000
- PocketBase admin UI: http://127.0.0.1:8090/_/

Admin login: `adriansraitums95@gmail.com` — password was generated at setup
time and shared separately (change it from the admin UI's account settings
once you've logged in).

## Why the site updates when you edit content in the admin UI

Every page fetch (`src/lib/data.ts`) queries PocketBase directly over HTTP
with `cache: "no-store"`, and the homepage is marked `force-dynamic`. There's
no build step or cache in between — edit a price or testimonial in the
PocketBase admin UI, reload the site, and the change is there.

## `node_modules`, `.next`, and `pocketbase/pb_data` are symlinks — don't move them back

This project lives under `~/Documents`, which is synced by iCloud Drive
("Desktop & Documents Folders"). iCloud tries to sync every file individually,
and `node_modules` alone is tens of thousands of small files — that made
`next dev` unusable (every file read got stuck for seconds behind iCloud's
sync daemons). The fix: `node_modules`, `.next`, and `pocketbase/pb_data` were
moved to `~/Library/Caches/tobio_suhi/` (which macOS never syncs to iCloud)
and replaced in the project with symlinks pointing there. Everything works
exactly the same — `npm install`, `npm run dev`, etc. — just don't delete the
symlinks or move their targets back into `~/Documents`.

One consequence: Next.js's default bundler, Turbopack, refuses to follow a
symlink that points outside the project's filesystem root, so `dev`/`build`
in `package.json` explicitly pass `--webpack`. If you ever relocate the
project outside iCloud (recommended long-term — see below) you can drop
`--webpack` and use Turbopack again.

**Longer-term recommendation:** move the whole project out of `~/Documents`
(e.g. to `~/Developer/tobio_suhi` or `~/Projects/tobio_suhi`), which are
outside iCloud's sync scope, and undo the symlink workaround. Not required —
the current setup works fine — just cleaner.

## Content model (PocketBase collections)

All public-read, superuser-write only:

- `menu_items` — name, description, price, category, tags, sort_order, active
- `locations` — Sigulda & Cēsis: address, phone, hours, rating, maps link
- `testimonials` — author, quote, rating, source
- `roll_builder_options` — rice / protein / extra options with prices, used
  by the "Uztaisi savu roll'u" builder
- `site_settings` — single record: hero copy, roll-builder base price,
  Google reviews link, and an optional manual override for the daily pick
  (`daily_special_manual`, a relation to `menu_items`) — if unset, the site
  falls back to a day-of-week rotation through the curated menu items
  (`src/lib/data.ts` → `resolveDailySpecial`)

The schema itself is versioned as PocketBase migrations in
`pocketbase/pb_migrations/` (committed to git); the actual data lives in
`pocketbase/pb_data/` (gitignored — it's a local SQLite database, not source).

## Deploying for real (not done yet — see conversation for the outline)

- PocketBase: a small always-on VM (e.g. Oracle Cloud Always Free, EU region)
  running the `pocketbase` binary as a systemd service behind a domain/HTTPS
  (Caddy or nginx).
- Frontend: deploy to Vercel, pointing `NEXT_PUBLIC_POCKETBASE_URL` at the
  production PocketBase domain instead of `127.0.0.1`.

# Tobio Sushi — demo site

Next.js 16 (App Router, TypeScript, Tailwind v4) frontend backed by
[Nhost](https://nhost.io) — a managed PostgreSQL database, GraphQL API
(Hasura), and auth service. There's no backend process to run locally;
Nhost is a hosted cloud project.

## Running locally

```bash
npm run dev
```

- Site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

Admin login: `adriansraitums95@gmail.com` — password was generated at setup
time and shared separately. There's no public sign-up; only that one account
can log in and edit content.

## Environment variables

Set in `.env.local` (gitignored):

```
NEXT_PUBLIC_NHOST_SUBDOMAIN=whinhywwlviydqcfnxkz
NEXT_PUBLIC_NHOST_REGION=eu-central-1
```

These aren't secret — they're just the coordinates the Nhost SDK uses to
build service URLs, and the same two values need to go into Vercel's project
environment variables when you deploy the frontend.

The Hasura **admin secret** is a separate, actually-sensitive credential
(found in the Nhost dashboard → Settings → Secrets → `HASURA_GRAPHQL_ADMIN_SECRET`,
write-only — Nhost never shows a saved value back). It was only ever used
server-side, one-off, to create tables/permissions/seed data via direct
`curl` calls during setup. It is **not** in any file in this repo and the
running app never needs it — only the `user`-role JWT from a logged-in
admin session does, which Hasura permissions already scope to full CRUD on
these 5 tables and nothing else.

## Why the site updates when you edit content in the admin panel

Every page fetch (`src/lib/data.ts`) queries the public Nhost GraphQL
endpoint directly with `cache: "no-store"`, and the homepage is marked
`force-dynamic`. There's no build step or cache in between — edit something
in `/admin`, reload the site, and the change is there.

## `node_modules` and `.next` are symlinks — don't move them back

This project lives under `~/Documents`, which is synced by iCloud Drive
("Desktop & Documents Folders"). iCloud tries to sync every file
individually, and `node_modules` alone is tens of thousands of small files —
that made `next dev` unusable (every file read got stuck for seconds behind
iCloud's sync daemons). The fix: `node_modules` and `.next` were moved to
`~/Library/Caches/tobio_suhi/` (which macOS never syncs to iCloud) and
replaced in the project with symlinks pointing there. Everything works
exactly the same — `npm install`, `npm run dev`, etc. — just don't delete
the symlinks or move their targets back into `~/Documents`.

One consequence: Next.js's default bundler, Turbopack, refuses to follow a
symlink that points outside the project's filesystem root, so `dev`/`build`
in `package.json` explicitly pass `--webpack`. If you ever relocate the
project outside iCloud (recommended long-term — see below) you can drop
`--webpack` and use Turbopack again.

**Longer-term recommendation:** move the whole project out of `~/Documents`
(e.g. to `~/Developer/tobio_suhi` or `~/Projects/tobio_suhi`), which are
outside iCloud's sync scope, and undo the symlink workaround. Not required —
the current setup works fine — just cleaner.

## Content model (Postgres tables via Hasura/Nhost)

`public` role = read-only (and only `active = true` rows on the three tables
that have that column); `user` role (the one signed-in admin) = full CRUD.

- `menu_items` — name, description, price, `price_large` (for the 8pc/16pc
  dual pricing tobio.lv uses), size labels, category, tags, active, sort_order
- `locations` — Sigulda & Cēsis: address, phone, hours, rating, maps link
- `testimonials` — author, quote, rating, source
- `roll_builder_options` — rice/protein/extra options for the "Uztaisi savu
  roll'u" builder, using only ingredient names that actually appear on the
  real menu (pricing for this feature is illustrative — Tobio doesn't
  actually sell build-your-own à la carte, see conversation)
- `site_settings` — single row: hero copy, roll-builder base price, Google
  reviews link, both Wolt ordering links, and an optional manual override
  for the daily pick (`daily_special_manual_id`, FK to `menu_items`) — if
  unset, the site falls back to a day-of-week rotation through the menu
  (`src/lib/data.ts` → `resolveDailySpecial`)

Schema + permissions were created via direct SQL/Hasura metadata calls
during setup (see conversation for the exact statements) rather than a
committed migrations folder — Nhost's own config-as-code (`nhost.toml` +
dashboard) is the source of truth for this project's schema going forward.

## Deploying for real

- **Nhost**: already a hosted cloud project — nothing to deploy, it's live now.
- **Frontend**: deploy to Vercel, set `NEXT_PUBLIC_NHOST_SUBDOMAIN` and
  `NEXT_PUBLIC_NHOST_REGION` (same values as `.env.local`) in the Vercel
  project's environment variables.

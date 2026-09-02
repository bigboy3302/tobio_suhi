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

For real Google reviews to appear on the site, one more (this one *is*
secret) is needed — see "Real Google reviews" below:

```
GOOGLE_PLACES_API_KEY=...
```

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

`public` role = read-only (and only `active = true` rows on the tables that
have that column); `user` role (the one signed-in admin) = full CRUD.

- `menu_items` — name, description, price, `price_large` (for the 8pc/16pc
  dual pricing tobio.lv uses), size labels, category, tags, active, sort_order,
  and an optional photo (`image_id`/`image_alt`, uploaded via Nhost Storage —
  see below)
- `locations` — Sigulda & Cēsis: address, phone, hours, rating, Maps link,
  Google `google_place_id` (for real reviews — see below), optional photo
- `roll_builder_options` — rice/protein/extra options for the "Uztaisi savu
  roll'u" builder, using only ingredient names that actually appear on the
  real menu (pricing for this feature is illustrative — Tobio doesn't
  actually sell build-your-own à la carte, see conversation)
- `site_settings` — single row: roll-builder base price, Google reviews link,
  both Wolt ordering links, an optional hero background photo, and an
  optional manual override for the daily pick (`daily_special_manual_id`, FK
  to `menu_items`) — if unset, the site falls back to a day-of-week rotation
  through the menu (`src/lib/data.ts` → `resolveDailySpecial`)
- `site_copy` — every section heading, card, and body paragraph across the
  site as `{key, lv, en}` rows, edited from `/admin`'s **Saturs** tab (see
  `src/lib/i18n.tsx` for how a row here overrides the static dictionary
  default, per language)
- `testimonials` — **no longer rendered on the site** (see "Real Google
  reviews" below). The table and its admin CRUD (`/admin` → Atsauksmes) still
  exist but are inert; a banner in that tab says so.

Images are stored in Nhost's built-in Storage service (same project, same
credentials — no separate S3/Blob setup), uploaded via the admin panel's
image fields and served publicly through `src/lib/nhostStorage.ts`.

Schema + permissions were created via direct SQL/Hasura metadata calls
during setup (see conversation for the exact statements) rather than a
committed migrations folder — Nhost's own config-as-code (`nhost.toml` +
dashboard) is the source of truth for this project's schema going forward.

## Real Google reviews

The Reviews section pulls live reviews directly from each location's Google
Business listing via the Google Places API — not hand-typed quotes. Getting
this working needs two things only the account owner can provide:

1. **An API key.** In the [Google Cloud
   Console](https://console.cloud.google.com/), create a project (or use an
   existing one), enable billing on it (Google requires a billing account
   attached even though there's a monthly free quota), enable the **Places
   API** (the classic one — not "Places API (New)"), then create an API key
   under APIs & Services → Credentials. Restrict the key to the Places API
   only. It's used server-side only (`GOOGLE_PLACES_API_KEY`, no
   `NEXT_PUBLIC_` prefix), so it's never sent to the browser.
2. **A Place ID per location.** This is a different identifier than the
   `cid=` value in the Google Maps links already stored in Settings — the
   Places API needs its own Place ID, findable with Google's [Place ID
   Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
   (search the business name/address on the embedded map there). Paste each
   one into `/admin` → Atrašanās vietas → "Google Place ID (atsauksmēm)" for
   the matching location.

Once both are in place (the key as an env var — locally in `.env.local`,
in production in Vercel's project settings, redeploy after adding it — and
a Place ID on each location), reviews start showing up automatically; no
code change needed. Reviews are grouped into one box per location (Sigulda /
Cēsis) rather than mixed together.

Until then, the Reviews section simply doesn't render (see
`src/lib/googleReviews.ts` — any missing config or failed request returns an
empty list, on purpose, rather than ever showing placeholder text). The
aggregate "X out of 5 — N+ Google reviews" banner lower on the page is
unaffected either way — it's driven by the rating/count already stored on
each location, not by this API call.

The same request also pulls each location's live `open_now` status from
Google (`opening_hours` field, same API call as the reviews — no extra
cost), shown as an "Open now"/"Closed" badge on each location card. This is
now the authoritative source for that badge — note Google's actual listed
hours can differ slightly from the `hours_weekdays`/`hours_weekend` text
shown under the address (that text is a separate, simpler admin-entered
field; the badge doesn't parse it). If Google's status isn't available for
some reason, the badge falls back to computing it from that text field
instead of disappearing outright (`src/lib/hours.ts`).

Reviews + open/closed status are fetched together with a 15-minute cache
(`next: { revalidate: 900 }` in `getGooglePlaceData`) rather than on every
page load — short enough that "open now" doesn't go stale for hours, long
enough to stay well within the free monthly quota for two locations (the
Places API bills per request past that allotment). Google's Place Details
`reviews` field returns at most 5 reviews per place, in whatever
order/selection Google provides; there's no way to curate which ones show.

## Structured data (JSON-LD)

The homepage renders a `Restaurant` schema.org block per location (as a
server-rendered `<script type="application/ld+json">`, so crawlers see it in
the initial HTML — see `src/lib/structuredData.ts`) — Sigulda and Cēsis are
each their own `Restaurant` entity, not one combined one. Opening hours come
from the same `hours_weekdays`/`hours_weekend` admin fields shown on the
page, so it can't go stale when the owner edits hours in `/admin`. The
`aggregateRating` prefers Google's live rating/review count (the same
Places API call already feeding Reviews and the open/closed badge) over the
location's stored `rating`/`reviews_count`, falling back to the stored value
only if Google's data is unavailable — this is deliberate so the number in
search results can't drift from what's actually on the page.

After deploying, validate both entries with [Google's Rich Results
Test](https://search.google.com/test/rich-results) against the live URL.

## A note on hydration errors and `new Date()`

Two components previously called `new Date()` directly during render
(`DailyPick`'s weekday label, `Footer`'s copyright year) despite being
server-rendered — that meant the *server's* render (Vercel's clock/timezone)
and the *client's* hydration render (the visitor's own clock/timezone) could
compute a different day or year and produce a React hydration error (#418)
whenever they landed on opposite sides of a day/year boundary. Both values
are now computed once, server-side (`resolveDailySpecial` in `src/lib/data.ts`
for the weekday; inline in each page for the year) and passed down as props,
so the client never recomputes them. If a similar "computed at render time"
value gets added elsewhere, prefer this pattern (compute server-side, pass
as a prop) over calling `new Date()`/`Math.random()`/reading `window` during
render — see `src/components/OpenStatusBadge.tsx` for the alternative
pattern (defer to `useEffect`, stable placeholder on first paint) for values
that only make sense once mounted.

## Deploying for real

- **Nhost**: already a hosted cloud project — nothing to deploy, it's live now.
- **Frontend**: deploy to Vercel, set `NEXT_PUBLIC_NHOST_SUBDOMAIN` and
  `NEXT_PUBLIC_NHOST_REGION` (same values as `.env.local`) in the Vercel
  project's environment variables.

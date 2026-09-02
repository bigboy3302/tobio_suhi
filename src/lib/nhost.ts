import { createClient, createNhostClient } from "@nhost/nhost-js";

const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!;
const region = process.env.NEXT_PUBLIC_NHOST_REGION!;

/**
 * Plain, unauthenticated client for public reads on the server (Server
 * Components). No session middleware — requests carry no Authorization
 * header, so Hasura resolves them as the `public` role. Safe to construct
 * fresh per request since it holds no session state.
 */
export function getPublicNhost() {
  return createNhostClient({ subdomain, region, configure: [] });
}

/**
 * Browser client for the /admin page: persists the session in
 * localStorage and auto-refreshes tokens, so `nhost.auth.signInEmailPassword`
 * and subsequent authenticated GraphQL requests work across reloads.
 */
export function createBrowserNhost() {
  return createClient({ subdomain, region });
}

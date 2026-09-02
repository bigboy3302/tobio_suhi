import type { Location } from "./types";

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  locationCity: string;
}

export interface GooglePlaceData {
  city: string;
  reviews: GoogleReview[];
  /** Google's own live open/closed status for this place, or null if unavailable. */
  openNow: boolean | null;
}

interface PlaceDetailsReview {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  text: string;
  relative_time_description: string;
}

interface PlaceDetailsResponse {
  status: string;
  result?: {
    reviews?: PlaceDetailsReview[];
    opening_hours?: { open_now?: boolean };
  };
}

// Reviews barely change day to day, but open/closed status does — a 24h
// cache (fine for reviews alone) would show stale "closed"/"open" for hours
// after the real status flips. Both are fetched in the same request, so this
// interval has to serve both; 15 minutes keeps the status reasonably live
// without hitting the API on every page load (still well within the free
// monthly quota for two locations).
const REVALIDATE_SECONDS = 60 * 15;

/**
 * Real reviews + live open/closed status pulled directly from each
 * location's Google Business listing via the Places API (Place Details,
 * `reviews` + `opening_hours` fields in one request — reviews capped at 5
 * per place by Google, in whatever order/selection Google returns).
 *
 * Requires GOOGLE_PLACES_API_KEY (server-only env var) and a `google_place_id`
 * set on each location in /admin — see README for how to obtain both. If
 * either is missing, or the request fails for any reason, a location comes
 * back with an empty reviews list and openNow: null rather than ever
 * falling back to placeholder text.
 */
export async function getGooglePlaceData(locations: Location[]): Promise<GooglePlaceData[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  return Promise.all(
    locations
      .filter((loc) => loc.google_place_id)
      .map((loc) => fetchPlaceData(loc.google_place_id!, loc.city, apiKey))
  );
}

async function fetchPlaceData(placeId: string, city: string, apiKey: string): Promise<GooglePlaceData> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "reviews,opening_hours");
  url.searchParams.set("key", apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      console.error(`Google Places request failed for ${city}: HTTP ${res.status}`);
      return { city, reviews: [], openNow: null };
    }
    const data: PlaceDetailsResponse = await res.json();
    if (data.status !== "OK" || !data.result) {
      console.error(`Google Places returned status "${data.status}" for ${city}`);
      return { city, reviews: [], openNow: null };
    }
    return {
      city,
      reviews: (data.result.reviews ?? []).map((r) => ({
        authorName: r.author_name,
        authorPhotoUrl: r.profile_photo_url ?? null,
        rating: r.rating,
        text: r.text,
        relativeTimeDescription: r.relative_time_description,
        locationCity: city,
      })),
      openNow: data.result.opening_hours?.open_now ?? null,
    };
  } catch (e) {
    console.error(`Google Places request threw for ${city}:`, e);
    return { city, reviews: [], openNow: null };
  }
}

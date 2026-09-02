import type { Location } from "./types";

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  locationCity: string;
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
  };
}

const REVALIDATE_SECONDS = 60 * 60 * 24; // refresh once a day — reviews don't change fast enough to justify more, and this is a billed API past the free monthly quota

/**
 * Real reviews pulled directly from each location's Google Business listing
 * via the Places API (Place Details, `reviews` field — capped at 5 per
 * place by Google, in whatever order/selection Google returns).
 *
 * Requires GOOGLE_PLACES_API_KEY (server-only env var) and a `google_place_id`
 * set on each location in /admin — see README for how to obtain both. If
 * either is missing, or the request fails for any reason, this returns an
 * empty array rather than ever falling back to placeholder text.
 */
export async function getGoogleReviews(locations: Location[]): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  const results = await Promise.all(
    locations
      .filter((loc) => loc.google_place_id)
      .map((loc) => fetchPlaceReviews(loc.google_place_id!, loc.city, apiKey))
  );

  return results.flat();
}

async function fetchPlaceReviews(
  placeId: string,
  city: string,
  apiKey: string
): Promise<GoogleReview[]> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "reviews");
  url.searchParams.set("key", apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      console.error(`Google Places request failed for ${city}: HTTP ${res.status}`);
      return [];
    }
    const data: PlaceDetailsResponse = await res.json();
    if (data.status !== "OK" || !data.result?.reviews) {
      console.error(`Google Places returned status "${data.status}" for ${city}`);
      return [];
    }
    return data.result.reviews.map((r) => ({
      authorName: r.author_name,
      authorPhotoUrl: r.profile_photo_url ?? null,
      rating: r.rating,
      text: r.text,
      relativeTimeDescription: r.relative_time_description,
      locationCity: city,
    }));
  } catch (e) {
    console.error(`Google Places request threw for ${city}:`, e);
    return [];
  }
}

import { parseHours } from "./hours";
import type { GooglePlaceData } from "./googleReviews";
import type { Location } from "./types";

const WEEKDAY_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const WEEKEND_DAYS = ["Saturday", "Sunday"];

/**
 * `address` is one free-text field ("Raiņa iela 1, Sigulda, LV-2150") rather
 * than separate columns — split it the same way `parseHours` pulls opening
 * hours out of text, instead of adding DB columns for a SEO-only concern.
 */
function parseStreetAndPostal(address: string): { streetAddress: string; postalCode: string | null } {
  const postalMatch = address.match(/[A-Z]{2}-\d{4,5}\b/);
  return {
    streetAddress: address.split(",")[0].trim(),
    postalCode: postalMatch ? postalMatch[0] : null,
  };
}

export function buildRestaurantJsonLd(
  locations: Location[],
  placeData: GooglePlaceData[],
  siteUrl: string
) {
  const restaurants = locations.map((loc) => {
    const weekday = parseHours(loc.hours_weekdays);
    const weekend = parseHours(loc.hours_weekend);
    const openingHoursSpecification = [
      weekday && {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAY_DAYS,
        opens: weekday.opens,
        closes: weekday.closes,
      },
      weekend && {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKEND_DAYS,
        opens: weekend.opens,
        closes: weekend.closes,
      },
    ].filter(Boolean);

    const { streetAddress, postalCode } = parseStreetAndPostal(loc.address);

    // Prefer Google's own live numbers (same fetch already feeding the
    // Reviews section) so this can't drift from what visitors actually see
    // there; fall back to the location's stored rating/count only when
    // Google's data isn't available (no API key/place id, or request failed).
    const live = placeData.find((p) => p.city === loc.city);
    const ratingValue = live?.rating ?? loc.rating;
    const reviewCount = live?.reviewsCount ?? loc.reviews_count;

    return {
      "@type": "Restaurant",
      "@id": `${siteUrl}/#${loc.city.toLowerCase()}`,
      name: loc.name,
      image: `${siteUrl}/og-image.jpg`,
      url: siteUrl,
      telephone: loc.phone,
      priceRange: "€€",
      servesCuisine: ["Japanese", "Sushi"],
      hasMenu: `${siteUrl}/menu`,
      address: {
        "@type": "PostalAddress",
        streetAddress,
        addressLocality: loc.city,
        addressCountry: "LV",
        ...(postalCode ? { postalCode } : {}),
      },
      ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
      ...(ratingValue > 0 && reviewCount > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue,
              reviewCount,
            },
          }
        : {}),
      ...(loc.google_maps_url ? { hasMap: loc.google_maps_url } : {}),
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": restaurants,
  };
}

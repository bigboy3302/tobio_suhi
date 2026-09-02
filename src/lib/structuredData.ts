import { parseHours } from "./hours";
import type { Location } from "./types";

const WEEKDAY_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const WEEKEND_DAYS = ["Saturday", "Sunday"];

export function buildRestaurantJsonLd(locations: Location[], siteUrl: string) {
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

    return {
      "@type": "Restaurant",
      "@id": `${siteUrl}/#${loc.city.toLowerCase()}`,
      name: loc.name,
      image: `${siteUrl}/og-image.jpg`,
      url: siteUrl,
      telephone: loc.phone,
      priceRange: "€€",
      servesCuisine: "Japanese",
      hasMenu: `${siteUrl}/menu`,
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.address,
        addressLocality: loc.city,
        addressCountry: "LV",
      },
      ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
      ...(loc.rating > 0 && loc.reviews_count > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: loc.rating,
              reviewCount: loc.reviews_count,
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

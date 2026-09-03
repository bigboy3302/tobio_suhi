"use client";

import { Star } from "lucide-react";
import type { Location } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

// Google's own universal "write a review" deep link — takes the visitor
// straight into the review composer for that exact place, built from the
// place_id we already store per location (no admin field or extra API
// call needed). Falls back to the location's Maps link (still
// location-correct) only if a place_id isn't set yet.
function reviewLink(loc: Location): string | null {
  if (loc.google_place_id) {
    return `https://search.google.com/local/writereview?placeid=${loc.google_place_id}`;
  }
  return loc.google_maps_url || null;
}

export default function GoogleReviewsCTA({ locations }: { locations: Location[] }) {
  const { t } = useLanguage();
  const totalReviews = locations.reduce((sum, l) => sum + (l.reviews_count || 0), 0);
  const avgRating =
    locations.length > 0
      ? locations.reduce((sum, l) => sum + (l.rating || 0), 0) / locations.length
      : 4.8;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14 lg:px-8">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-ink px-6 py-12 text-center text-cream sm:px-10">
        <div className="flex gap-1 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-gold" />
          ))}
        </div>
        <p className="font-display text-2xl font-bold sm:text-3xl">
          {avgRating.toFixed(1)} {t("googleReviews.outOf5")} &mdash;{" "}
          {t("googleReviews.count", { n: totalReviews })}
        </p>
        <p className="max-w-md text-sm text-cream/70">{t("googleReviews.body")}</p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          {locations.map((loc) => {
            const href = reviewLink(loc);
            if (!href) return null;
            return (
              <a
                key={loc.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                {t("googleReviews.ctaCity", { city: loc.city })}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

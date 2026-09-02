"use client";

import { Star } from "lucide-react";
import type { Location } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function GoogleReviewsCTA({
  locations,
  reviewsUrl,
}: {
  locations: Location[];
  reviewsUrl: string;
}) {
  const { t } = useLanguage();
  const totalReviews = locations.reduce((sum, l) => sum + (l.reviews_count || 0), 0);
  const avgRating =
    locations.length > 0
      ? locations.reduce((sum, l) => sum + (l.rating || 0), 0) / locations.length
      : 4.8;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
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
        <a
          href={reviewsUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          {t("googleReviews.cta")}
        </a>
      </div>
    </section>
  );
}

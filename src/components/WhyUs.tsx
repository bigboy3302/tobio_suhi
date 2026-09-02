"use client";

import { HandPlatter, Leaf, MapPin, PartyPopper, Sparkles, Star } from "lucide-react";
import type { Location } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function WhyUs({ locations }: { locations: Location[] }) {
  const { t } = useLanguage();
  const avgRating =
    locations.length > 0
      ? locations.reduce((sum, l) => sum + (l.rating || 0), 0) / locations.length
      : null;
  const totalReviews = locations.reduce((sum, l) => sum + (l.reviews_count || 0), 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-coral-dark">
          {t("why.eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t("why.heading")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
        <div className="col-span-2 row-span-1 rounded-3xl bg-ink p-6 text-cream md:row-span-2">
          <Leaf className="h-8 w-8 text-matcha" />
          <h3 className="mt-4 font-display text-xl font-semibold">{t("why.freshTitle")}</h3>
          <p className="mt-2 text-sm text-cream/70">{t("why.freshBody")}</p>
        </div>

        <div className="rounded-3xl bg-coral p-6 text-ink">
          <Star className="h-7 w-7" />
          <p className="mt-3 font-display text-2xl font-bold">
            {avgRating ? avgRating.toFixed(1) : "4.8"}
          </p>
          <p className="mt-0.5 text-xs text-ink/85">
            {totalReviews > 0 ? t("why.ratingFrom", { n: totalReviews }) : t("why.ratingAvg")}
          </p>
        </div>

        <div className="rounded-3xl bg-cream-soft p-6">
          <MapPin className="h-7 w-7 text-ink" />
          <p className="mt-3 font-display text-2xl font-bold text-ink">{locations.length || 2}</p>
          <p className="mt-0.5 text-xs text-ink-soft">{t("why.locationsLabel")}</p>
        </div>

        <div className="rounded-3xl bg-matcha p-6 text-ink">
          <PartyPopper className="h-7 w-7" />
          <h3 className="mt-3 font-display text-lg font-semibold">{t("why.setsTitle")}</h3>
          <p className="mt-1 text-xs text-ink/80">{t("why.setsBody")}</p>
        </div>

        <div className="rounded-3xl bg-gold p-6 text-ink">
          <HandPlatter className="h-7 w-7" />
          <h3 className="mt-3 font-display text-lg font-semibold">{t("why.chefTitle")}</h3>
          <p className="mt-1 text-xs text-ink/75">{t("why.chefBody")}</p>
        </div>

        <div className="col-span-2 rounded-3xl bg-cream-soft p-6 md:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-coral-dark" />
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {t("why.builderTitle")}
                </h3>
                <p className="text-xs text-ink-soft">{t("why.builderBody")}</p>
              </div>
            </div>
            <a
              href="#roll-builder"
              className="whitespace-nowrap rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              {t("why.builderCta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

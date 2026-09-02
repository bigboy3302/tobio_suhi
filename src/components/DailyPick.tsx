"use client";

import { ChefHat, Sparkles } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { DAY_NAMES, useLanguage } from "@/lib/i18n";

export default function DailyPick({
  item,
  isManual,
  dayOfWeek,
}: {
  item: MenuItem | null;
  isManual: boolean;
  /** Server-computed (see resolveDailySpecial) — never recomputed with
   *  `new Date()` here, since that would re-run at hydration time using the
   *  visitor's own clock and could mismatch the server's render. */
  dayOfWeek: number;
}) {
  const { lang, t } = useLanguage();
  if (!item) return null;

  const dayName = DAY_NAMES[lang][dayOfWeek];

  return (
    <section id="izveletie" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 rounded-3xl border-2 border-ink bg-cream-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-coral text-ink">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-coral-dark">
              <Sparkles className="h-3.5 w-3.5" />
              {t("daily.eyebrow")} &middot; {isManual ? t("daily.chefSpecial") : dayName}
            </p>
            <h3 className="mt-1.5 font-display text-2xl font-bold text-ink">{item.name}</h3>
            <p className="mt-1 max-w-xl text-sm text-ink-soft">{item.description}</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end sm:gap-1">
          <p className="font-display text-3xl font-bold text-ink">
            &euro;{item.price.toFixed(2)}
          </p>
          <a
            href="#ediena-karte"
            className="whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
          >
            {t("daily.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import type { Location, MenuItem, SiteSettings } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { nhostFileUrl } from "@/lib/nhostStorage";

export default function Hero({
  settings,
  menuItems,
  locations,
}: {
  settings: SiteSettings | null;
  menuItems: MenuItem[];
  locations: Location[];
}) {
  const { t } = useLanguage();
  const headline = settings?.hero_headline || "Svaigi suši. Gatavots ar sirdi.";
  const subtext =
    settings?.hero_subtext ||
    "Roku darbs, svaigi produkti un japāņu gatavošanas tradīcijas — katru dienu no jauna Siguldā un Cēsīs.";

  const marqueeNames = menuItems.slice(0, 12).map((m) => m.name);
  const primaryLocation = locations[0];
  const heroImageSrc = settings?.hero_image_id
    ? nhostFileUrl(settings.hero_image_id)
    : "/tobio-jungle-texture.png";
  const heroImageAlt = settings?.hero_image_id ? settings.hero_image_alt || "" : "";

  return (
    <section id="top" className="relative overflow-hidden bg-jungle">
      <div className="absolute inset-0">
        <Image
          key={heroImageSrc}
          src={heroImageSrc}
          alt={heroImageAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-jungle via-jungle/65 to-jungle/25" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-jungle to-transparent" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <span className="relative inline-block text-xs font-semibold uppercase tracking-[0.2em] text-leaf">
          Sigulda &middot; Cēsis
          <svg
            className="absolute -bottom-1.5 left-0 w-full"
            height="7"
            viewBox="0 0 120 7"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M1,4.5 C10,1 18,6 28,3 C38,0.5 47,5.5 58,3.5 C69,1.5 78,5 89,3 C99,1.2 108,4.8 119,2.5"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-wide text-white sm:text-6xl">
          {headline}
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
          {subtext}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#ediena-karte"
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3.5 text-sm font-semibold text-jungle shadow-lg shadow-leaf/30 transition-transform hover:-translate-y-0.5"
          >
            {t("hero.ctaMenu")}
            <ArrowRight className="h-4 w-4" />
          </a>
          {primaryLocation && (
            <a
              href={`tel:${primaryLocation.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-leaf hover:text-leaf"
            >
              <Phone className="h-4 w-4" />
              {t("hero.ctaCall")}
            </a>
          )}
        </div>

        <div className="mt-10 flex items-center gap-5 border-t border-white/10 pt-6">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-leaf">{menuItems.length}+</span>
            <span className="text-xs text-white/55">{t("hero.statItems")}</span>
          </p>
          <span className="h-9 w-px bg-white/15" />
          <p className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-leaf">{locations.length}</span>
            <span className="text-xs text-white/55">{t("hero.statCities")}</span>
          </p>
        </div>
      </div>

      {marqueeNames.length > 0 && (
        <div className="relative -rotate-1 overflow-hidden border-y-2 border-leaf/30 bg-foliage-dark py-3">
          <div className="flex w-max animate-marquee whitespace-nowrap">
            {[...marqueeNames, ...marqueeNames].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="mx-4 flex items-center gap-4 font-display text-xl tracking-wide text-white/90 sm:text-2xl"
              >
                {name}
                <span className="text-leaf">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

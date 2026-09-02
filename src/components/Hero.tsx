import { ArrowRight, Phone } from "lucide-react";
import type { Location, MenuItem, SiteSettings } from "@/lib/types";

export default function Hero({
  settings,
  menuItems,
  locations,
}: {
  settings: SiteSettings | null;
  menuItems: MenuItem[];
  locations: Location[];
}) {
  const headline = settings?.hero_headline || "Svaigs suši. Gatavots ar sirdi.";
  const subtext =
    settings?.hero_subtext ||
    "Roku darbs, svaigi produkti un japāņu gatavošanas tradīcijas — katru dienu no jauna Siguldā un Cēsīs.";

  const marqueeNames = menuItems.slice(0, 12).map((m) => m.name);
  const primaryLocation = locations[0];

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-14 sm:pt-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-coral/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-matcha/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-cream">
              Sigulda &middot; Cēsis
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              {subtext}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#ediena-karte"
                className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-cream shadow-lg shadow-coral/30 transition-transform hover:-translate-y-0.5"
              >
                Skatīt ēdienkarti
                <ArrowRight className="h-4 w-4" />
              </a>
              {primaryLocation && (
                <a
                  href={`tel:${primaryLocation.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  <Phone className="h-4 w-4" />
                  Piezvanīt un pasūtīt
                </a>
              )}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="col-span-2 rounded-3xl bg-ink p-6 text-cream">
              <p className="font-display text-lg font-semibold">Katru dienu svaigs</p>
              <p className="mt-1 text-sm text-cream/70">
                Svaigs lasis un kvalitatīvas sastāvdaļas — bez saldēšanas.
              </p>
            </div>
            <div className="rounded-3xl bg-matcha p-6 text-cream">
              <p className="font-display text-3xl font-bold">{menuItems.length}+</p>
              <p className="mt-1 text-sm text-cream/85">ēdienkartes pozīcijas</p>
            </div>
            <div className="rounded-3xl bg-gold p-6 text-ink">
              <p className="font-display text-3xl font-bold">{locations.length}</p>
              <p className="mt-1 text-sm text-ink/75">atrašanās vietas Latvijā</p>
            </div>
          </div>
        </div>
      </div>

      {marqueeNames.length > 0 && (
        <div className="mt-14 -rotate-1 overflow-hidden border-y-2 border-ink bg-ink py-3">
          <div className="flex w-max animate-marquee whitespace-nowrap">
            {[...marqueeNames, ...marqueeNames].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="mx-4 flex items-center gap-4 font-display text-lg font-semibold text-cream/90 sm:text-xl"
              >
                {name}
                <span className="text-coral">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

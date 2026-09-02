import { Clock, MapPin, Phone, Star } from "lucide-react";
import type { Location } from "@/lib/types";

export default function Locations({ locations }: { locations: Location[] }) {
  if (locations.length === 0) return null;

  return (
    <section id="atrasanas-vietas" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-coral-dark">
          Atrašanās vietas
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Divas vietas, viena kvalitāte
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {locations.map((loc) => (
          <div key={loc.id} className="rounded-3xl border border-ink/10 bg-cream-soft p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-ink">{loc.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                  <MapPin className="h-4 w-4 flex-none" />
                  {loc.address}
                </p>
              </div>
              {loc.rating > 0 && (
                <div className="flex flex-none items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-sm font-bold text-ink">
                  <Star className="h-3.5 w-3.5 fill-ink" />
                  {loc.rating.toFixed(1)}
                </div>
              )}
            </div>

            <div className="mt-5 space-y-2 text-sm text-ink-soft">
              {loc.hours_weekdays && (
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-none" />
                  {loc.hours_weekdays}
                </p>
              )}
              {loc.hours_weekend && (
                <p className="flex items-center gap-2 pl-6">{loc.hours_weekend}</p>
              )}
              {loc.reviews_count > 0 && (
                <p className="pl-6 text-xs text-ink-soft/80">
                  {loc.reviews_count}+ Google atsauksmes
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                {loc.phone}
              </a>
              {loc.google_maps_url && (
                <a
                  href={loc.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  Maršruts
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

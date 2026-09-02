import type { Location } from "@/lib/types";

export default function Footer({ locations }: { locations: Location[] }) {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-cream pb-24 pt-10 md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-xl font-bold text-ink">TOBIO</p>
          <p className="mt-1 max-w-xs text-sm text-ink-soft">
            Svaigs suši, gatavots ar sirdi &mdash; Siguldā un Cēsīs.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm text-ink-soft">
          {locations.map((loc) => (
            <div key={loc.id}>
              <p className="font-semibold text-ink">{loc.name}</p>
              <p>{loc.address}</p>
              <p>{loc.phone}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-ink-soft/70 sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} Tobio Sushi. Visas tiesības aizsargātas.
      </p>
    </footer>
  );
}

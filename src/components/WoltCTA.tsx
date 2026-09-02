import { Send } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export default function WoltCTA({ settings }: { settings: SiteSettings | null }) {
  const sigulda = settings?.wolt_url_sigulda;
  const cesis = settings?.wolt_url_cesis;
  if (!sigulda && !cesis) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-matcha px-6 py-12 text-center text-cream sm:px-10">
        <Send className="h-9 w-9" />
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Pasūti Wolt lietotnē</h2>
        <p className="max-w-md text-sm text-cream/80">
          Piegādi Siguldā un Cēsīs nodrošina Wolt — atver mūsu profilu un pasūti tiešā ceļā.
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          {sigulda && (
            <a
              href={sigulda}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Pasūtīt Siguldā
            </a>
          )}
          {cesis && (
            <a
              href={cesis}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-cream px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              Pasūtīt Cēsīs
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Send } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function WoltCTA({ settings }: { settings: SiteSettings | null }) {
  const { t } = useLanguage();
  const sigulda = settings?.wolt_url_sigulda;
  const cesis = settings?.wolt_url_cesis;
  if (!sigulda && !cesis) return null;

  return (
    <section id="pasutit" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-matcha px-6 py-12 text-center text-ink sm:px-10">
        <Send className="h-9 w-9" />
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("wolt.heading")}</h2>
        <p className="max-w-md text-sm text-ink/80">{t("wolt.body")}</p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          {sigulda && (
            <a
              href={sigulda}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              {t("wolt.orderSigulda")}
            </a>
          )}
          {cesis && (
            <a
              href={cesis}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              {t("wolt.orderCesis")}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

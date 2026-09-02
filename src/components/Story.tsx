"use client";

import { useLanguage } from "@/lib/i18n";

export default function Story() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-jungle px-6 py-12 text-center sm:px-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-leaf">
          {t("story.eyebrow")}
        </p>
        <p className="mx-auto mt-4 max-w-2xl font-display text-2xl leading-snug text-white sm:text-3xl">
          {t("story.headline")}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
          {t("story.body")}
        </p>
      </div>
    </section>
  );
}

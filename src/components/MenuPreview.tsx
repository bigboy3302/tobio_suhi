"use client";

import type { MenuItem } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import MenuItemCard from "./MenuItemCard";

export default function MenuPreview({ items }: { items: MenuItem[] }) {
  const { t } = useLanguage();
  if (items.length === 0) return null;

  return (
    <section id="ediena-karte" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex max-w-3xl flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-coral-dark">
            {t("menu.eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {t("menu.heading")}
          </h2>
        </div>
        <a
          href="/menu"
          className="whitespace-nowrap text-sm font-semibold text-coral-dark underline-offset-4 hover:underline"
        >
          {t("menu.fullMenuLink")}
        </a>
      </div>

      <p className="mb-6 max-w-2xl text-xs text-ink-soft/80">{t("menu.allergenNote")}</p>

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

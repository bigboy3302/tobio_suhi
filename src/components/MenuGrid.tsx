"use client";

import { useMemo, useState } from "react";
import { type MenuCategory, type MenuItem } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import MenuItemCard from "./MenuItemCard";

export default function MenuGrid({ items }: { items: MenuItem[] }) {
  const { t } = useLanguage();
  const categories = useMemo(() => {
    const seen = new Set<MenuCategory>();
    items.forEach((i) => seen.add(i.category));
    return Array.from(seen);
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");

  const filtered = useMemo(
    () => (activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory)),
    [items, activeCategory]
  );

  if (items.length === 0) return null;

  return (
    <section id="ediena-karte" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-coral-dark">
          {t("menu.eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t("menu.heading")}
        </h2>
      </div>

      <p className="mb-6 max-w-2xl text-xs text-ink-soft/80">{t("menu.allergenNote")}</p>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterButton
          label={t("menu.all")}
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {categories.map((cat) => (
          <FilterButton
            key={cat}
            label={t(`category.${cat}`)}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft hover:bg-ink/10"
      }`}
    >
      {label}
    </button>
  );
}

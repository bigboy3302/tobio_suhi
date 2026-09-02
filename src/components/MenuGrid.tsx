"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Flame, Leaf, Sparkles, WheatOff } from "lucide-react";
import { type MenuCategory, type MenuItem, type MenuTag } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { nhostFileUrl } from "@/lib/nhostStorage";

const TAG_ICONS: Partial<Record<MenuTag, React.ComponentType<{ className?: string }>>> = {
  piktants: Flame,
  vegans: Leaf,
  bez_glutena: WheatOff,
  jauns: Sparkles,
};

export default function MenuGrid({
  items,
  linkToFullMenu,
  allergenText,
}: {
  items: MenuItem[];
  linkToFullMenu?: boolean;
  allergenText?: string | null;
}) {
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
      <div className="mb-8 flex max-w-3xl flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-coral-dark">
            {t("menu.eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {t("menu.heading")}
          </h2>
        </div>
        {linkToFullMenu && (
          <a
            href="/menu"
            className="whitespace-nowrap text-sm font-semibold text-coral-dark underline-offset-4 hover:underline"
          >
            {t("menu.fullMenuLink")}
          </a>
        )}
      </div>

      <p className="mb-6 max-w-2xl text-xs text-ink-soft/80">
        {allergenText || t("menu.allergenNote")}
      </p>

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-cream-soft transition-shadow hover:shadow-md"
          >
            {item.image_id && (
              <div className="relative aspect-[4/3] w-full flex-none">
                <Image
                  src={nhostFileUrl(item.image_id)}
                  alt={item.image_alt || item.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-ink">{item.name}</h3>
                <PriceTag item={item} />
              </div>
              {item.description && (
                <p className="mt-2 flex-1 text-sm text-ink-soft">{item.description}</p>
              )}
              {item.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => {
                    const Icon = TAG_ICONS[tag];
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                      >
                        {Icon && <Icon className="h-3 w-3" />}
                        {t(`tag.${tag}`)}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PriceTag({ item }: { item: MenuItem }) {
  if (item.price_large) {
    return (
      <div className="flex flex-none flex-col items-end whitespace-nowrap">
        <span className="font-display text-base font-bold text-coral-dark">
          &euro;{item.price.toFixed(2)}
          {item.size_small_label ? (
            <span className="ml-1 text-xs font-medium text-ink-soft">
              ({item.size_small_label})
            </span>
          ) : null}
        </span>
        <span className="font-display text-base font-bold text-coral-dark">
          &euro;{item.price_large.toFixed(2)}
          {item.size_large_label ? (
            <span className="ml-1 text-xs font-medium text-ink-soft">
              ({item.size_large_label})
            </span>
          ) : null}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-none flex-col items-end whitespace-nowrap">
      <span className="font-display text-lg font-bold text-coral-dark">
        &euro;{item.price.toFixed(2)}
      </span>
      {item.size_small_label && (
        <span className="text-xs font-medium text-ink-soft">{item.size_small_label}</span>
      )}
    </div>
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

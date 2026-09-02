"use client";

import Image from "next/image";
import { Flame, Leaf, Sparkles, WheatOff } from "lucide-react";
import type { MenuItem, MenuTag } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { nhostFileUrl } from "@/lib/nhostStorage";
import { useScrollReveal } from "@/lib/useScrollReveal";

const TAG_ICONS: Partial<Record<MenuTag, React.ComponentType<{ className?: string }>>> = {
  piktants: Flame,
  vegans: Leaf,
  bez_glutena: WheatOff,
  jauns: Sparkles,
};

export default function MenuItemCard({
  item,
  revealDelay,
}: {
  item: MenuItem;
  /**
   * Enables the scroll-reveal fade-up for this card, staggered by this delay
   * (ms). Omit entirely on the /menu page's full grid — with 60+ items a
   * reveal effect there would feel sluggish, and leaving this unset skips
   * the IntersectionObserver setup completely rather than just hiding the
   * animation, so there's no overhead either.
   */
  revealDelay?: number;
}) {
  const { t } = useLanguage();
  const reveal = useScrollReveal<HTMLElement>(revealDelay ?? 0, { enabled: revealDelay != null });

  return (
    <article
      ref={reveal.ref}
      style={reveal.style}
      className={`flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-cream-soft transition-shadow hover:shadow-md ${reveal.className}`}
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

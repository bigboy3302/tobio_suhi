"use client";

import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useLanguage();
  if (testimonials.length === 0) return null;

  return (
    <section id="atsauksmes" className="bg-cream-soft py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-coral-dark">
            {t("testimonials.eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {t("testimonials.heading")}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-3xl bg-cream p-6 shadow-sm">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? "fill-gold" : "fill-transparent text-ink/15"}`}
                  />
                ))}
              </div>
              <blockquote
                className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft"
                dangerouslySetInnerHTML={{ __html: t.quote }}
              />
              <figcaption className="mt-4 text-sm font-semibold text-ink">
                {t.author_name}
                {t.location_name && (
                  <span className="font-normal text-ink-soft"> &middot; {t.location_name}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

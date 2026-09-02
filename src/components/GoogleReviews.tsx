"use client";

import { Star } from "lucide-react";
import type { GoogleReview } from "@/lib/googleReviews";
import { useLanguage } from "@/lib/i18n";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function GoogleReviews({ reviews }: { reviews: GoogleReview[] }) {
  const { t } = useLanguage();
  if (reviews.length === 0) return null;

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

        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, index }: { review: GoogleReview; index: number }) {
  const reveal = useScrollReveal<HTMLElement>(index * 100);

  return (
    <figure
      ref={reveal.ref}
      style={reveal.style}
      className={`flex flex-col rounded-3xl bg-cream p-6 shadow-sm ${reveal.className}`}
    >
      <div className="flex gap-0.5 text-gold">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star
            key={j}
            className={`h-4 w-4 ${j < review.rating ? "fill-gold" : "fill-transparent text-ink/15"}`}
          />
        ))}
      </div>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
        {review.text}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2.5">
        {review.authorPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.authorPhotoUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="h-8 w-8 flex-none rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-ink/10 text-xs font-semibold text-ink-soft">
            {review.authorName.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="text-sm font-semibold text-ink">
          {review.authorName}
          <span className="font-normal text-ink-soft"> &middot; {review.locationCity}</span>
        </span>
      </figcaption>
    </figure>
  );
}

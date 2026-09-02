import { Star } from "lucide-react";
import type { Location } from "@/lib/types";

export default function GoogleReviewsCTA({
  locations,
  reviewsUrl,
}: {
  locations: Location[];
  reviewsUrl: string;
}) {
  const totalReviews = locations.reduce((sum, l) => sum + (l.reviews_count || 0), 0);
  const avgRating =
    locations.length > 0
      ? locations.reduce((sum, l) => sum + (l.rating || 0), 0) / locations.length
      : 4.8;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-ink px-6 py-12 text-center text-cream sm:px-10">
        <div className="flex gap-1 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-gold" />
          ))}
        </div>
        <p className="font-display text-2xl font-bold sm:text-3xl">
          {avgRating.toFixed(1)} no 5 &mdash; {totalReviews}+ Google atsauksmes
        </p>
        <p className="max-w-md text-sm text-cream/70">
          Pievienojies simtiem apmierinātu viesu Siguldā un Cēsīs. Dalies ar savu pieredzi!
        </p>
        <a
          href={reviewsUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
        >
          Skatīt Google atsauksmes
        </a>
      </div>
    </section>
  );
}

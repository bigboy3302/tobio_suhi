"use client";

import { useEffect, useState } from "react";
import type { Location } from "@/lib/types";
import { getLocationOpenStatus } from "@/lib/hours";
import { useLanguage } from "@/lib/i18n";

export default function OpenStatusBadge({
  location,
  openNow,
}: {
  location: Location;
  /** Google's own live status, if available — takes priority when present. */
  openNow: boolean | null;
}) {
  const { t } = useLanguage();
  // Fallback only: computed client-side from the admin-entered hours text,
  // used when Google's status isn't available (no API key/place id, or the
  // request failed). Computed on mount, not at render time, since "now"
  // must reflect the visitor's actual clock, not the server's render time.
  const [fallback, setFallback] = useState<boolean | null>(null);

  useEffect(() => {
    if (openNow === null) setFallback(getLocationOpenStatus(location));
  }, [location, openNow]);

  const isOpen = openNow ?? fallback;
  if (isOpen === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isOpen ? "bg-leaf/15 text-foliage-dark" : "bg-ink/10 text-ink-soft"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-leaf" : "bg-ink/30"}`} />
      {isOpen ? t("locations.openNow") : t("locations.closedNow")}
    </span>
  );
}

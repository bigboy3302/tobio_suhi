"use client";

import { useEffect, useState } from "react";
import type { Location } from "@/lib/types";
import { getLocationOpenStatus } from "@/lib/hours";
import { useLanguage } from "@/lib/i18n";

export default function OpenStatusBadge({ location }: { location: Location }) {
  const { t } = useLanguage();
  // computed on mount, not at render time, since "now" must reflect the
  // visitor's actual clock — computing it during SSR would bake in the
  // server's render time instead and could mismatch on hydration
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setIsOpen(getLocationOpenStatus(location));
  }, [location]);

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

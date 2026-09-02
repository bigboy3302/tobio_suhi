"use client";

import { Phone } from "lucide-react";
import type { Location } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function MobileOrderBar({ locations }: { locations: Location[] }) {
  const { t } = useLanguage();
  if (locations.length === 0) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-cream/95 p-3 backdrop-blur md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      {locations.map((loc) => (
        <a
          key={loc.id}
          href={`tel:${loc.phone.replace(/\s+/g, "")}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-coral py-3 text-sm font-semibold text-ink"
        >
          <Phone className="h-4 w-4" />
          {t("mobileBar.call", { city: loc.city })}
        </a>
      ))}
    </div>
  );
}

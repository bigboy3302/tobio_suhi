"use client";

import { Phone } from "lucide-react";
import type { Location } from "@/lib/types";

export default function MobileOrderBar({ locations }: { locations: Location[] }) {
  if (locations.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-cream/95 p-3 backdrop-blur md:hidden">
      {locations.map((loc) => (
        <a
          key={loc.id}
          href={`tel:${loc.phone.replace(/\s+/g, "")}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-coral py-3 text-sm font-semibold text-cream"
        >
          <Phone className="h-4 w-4" />
          Zvanīt {loc.city}
        </a>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import type { Location } from "@/lib/types";

const NAV_LINKS = [
  { href: "#izveletie", label: "Šodienas ieteikums" },
  { href: "#ediena-karte", label: "Ēdienkarte" },
  { href: "#roll-builder", label: "Uztaisi savu roll'u" },
  { href: "#atrasanas-vietas", label: "Atrašanās vietas" },
  { href: "#atsauksmes", label: "Atsauksmes" },
];

export default function Header({ locations }: { locations: Location[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-ink">
          TOBIO
          <span className="inline-block h-2 w-2 rounded-full bg-coral" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-coral-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {locations.map((loc) => (
            <a
              key={loc.id}
              href={`tel:${loc.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-cream px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-coral hover:text-coral-dark"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={2.5} />
              {loc.city}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-ink/15 p-2 lg:hidden"
          aria-label="Izvērst izvēlni"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-cream px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-cream-soft"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-ink/10 pt-3">
            {locations.map((loc) => (
              <a
                key={loc.id}
                href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream"
              >
                <Phone className="h-4 w-4" strokeWidth={2.5} />
                Zvanīt uz {loc.city}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

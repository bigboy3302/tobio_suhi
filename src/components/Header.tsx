"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
import type { Location } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";

const NAV_LINKS = [
  { href: "/#izveletie", key: "nav.daily" },
  { href: "/menu", key: "nav.menu" },
  { href: "/#roll-builder", key: "nav.builder" },
  { href: "/#atrasanas-vietas", key: "nav.locations" },
  { href: "/#atsauksmes", key: "nav.reviews" },
] as const;

export default function Header({ locations }: { locations: Location[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-leaf/20 bg-jungle/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <Image
            src="/tobio-logo.png"
            alt="Tobio Sushi"
            width={44}
            height={44}
            className="rounded-full ring-2 ring-leaf/40"
            priority
          />
          <span className="font-display text-2xl tracking-wide text-white">TOBIO</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/75 transition-colors hover:text-leaf"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          {locations.map((loc) => (
            <a
              key={loc.id}
              href={`tel:${loc.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-leaf hover:text-leaf"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={2.5} />
              {loc.city}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-white lg:hidden"
          aria-label={t("nav.expand")}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-leaf/20 bg-jungle px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-white/75 hover:bg-white/5 hover:text-leaf"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <LanguageToggle />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {locations.map((loc) => (
              <a
                key={loc.id}
                href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-leaf px-4 py-2.5 text-sm font-semibold text-jungle"
              >
                <Phone className="h-4 w-4" strokeWidth={2.5} />
                {t("nav.callCity", { city: loc.city })}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

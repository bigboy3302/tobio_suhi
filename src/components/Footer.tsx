"use client";

import { Mail } from "lucide-react";
import type { Location } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

const FACEBOOK_URL = "https://facebook.com/tobiosushi";
const INSTAGRAM_URL = "https://instagram.com/tobio_sushi";
const CONTACT_EMAIL = "tobiosushi@gmail.com";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.75h2.6l.39-3.02h-3v-1.93c0-.87.24-1.47 1.5-1.47h1.6V4.14C15.87 4.06 15.02 4 14.02 4c-2.13 0-3.59 1.3-3.59 3.68v2.55H7.82v3.02h2.61V21h3.07z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="17.15" cy="6.85" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer({ locations }: { locations: Location[] }) {
  const { t } = useLanguage();
  return (
    <footer className="mt-auto border-t border-ink/10 bg-cream pb-24 pt-10 md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-xl font-bold text-ink">TOBIO</p>
          <p className="mt-1 max-w-xs text-sm text-ink-soft">{t("footer.tagline")}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-coral-dark"
          >
            <Mail className="h-4 w-4" />
            {CONTACT_EMAIL}
          </a>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tobio Sushi Facebook"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-coral hover:text-coral-dark"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tobio Sushi Instagram"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-coral hover:text-coral-dark"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-8 text-sm text-ink-soft">
          {locations.map((loc) => (
            <div key={loc.id}>
              <p className="font-semibold text-ink">{loc.name}</p>
              <p>{loc.address}</p>
              <p>{loc.phone}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-ink-soft/70 sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} Tobio Sushi. {t("footer.rights")}
      </p>
    </footer>
  );
}

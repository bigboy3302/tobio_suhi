"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NhostClient } from "@nhost/nhost-js";
import type { Session } from "@nhost/nhost-js/auth";
import { LogOut } from "lucide-react";
import { createBrowserNhost } from "@/lib/nhost";
import SignInForm from "@/components/admin/SignInForm";
import MenuItemsAdmin from "@/components/admin/MenuItemsAdmin";
import LocationsAdmin from "@/components/admin/LocationsAdmin";
import TestimonialsAdmin from "@/components/admin/TestimonialsAdmin";
import SiteSettingsAdmin from "@/components/admin/SiteSettingsAdmin";
import SiteCopyAdmin from "@/components/admin/SiteCopyAdmin";

export const dynamic = "force-dynamic";

type Tab = "menu" | "locations" | "testimonials" | "copy" | "settings";

const IDLE_LIMIT_MS = 30 * 60 * 1000;
const WARNING_LEAD_MS = 60 * 1000;

export default function AdminPage() {
  const [nhost] = useState<NhostClient>(() => createBrowserNhost());
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");
  const [idleWarningSecondsLeft, setIdleWarningSecondsLeft] = useState<number | null>(null);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    setSession(nhost.getUserSession());
    setChecked(true);
  }, [nhost]);

  const handleSignOut = useCallback(async () => {
    const current = nhost.getUserSession();
    if (current) {
      await nhost.auth.signOut({ refreshToken: current.refreshToken }).catch(() => {});
    }
    nhost.clearSession();
    setSession(null);
  }, [nhost]);

  const markActive = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  function stayLoggedIn() {
    markActive();
    setIdleWarningSecondsLeft(null);
  }

  // Auto sign-out after 30 minutes with no activity anywhere on this page —
  // saved data (each tab's own "Saglabāt" button) is obviously unaffected,
  // but nothing here can know about *unsaved* edits in whichever tab is
  // open, so a 1-minute countdown warns first rather than silently signing
  // out mid-edit. Any activity (including the warning's own button) resets
  // the clock; the interval only drives the countdown display, it never
  // itself counts as activity.
  useEffect(() => {
    if (!session) return;
    lastActivityRef.current = Date.now();

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    const interval = setInterval(() => {
      const remainingMs = IDLE_LIMIT_MS - (Date.now() - lastActivityRef.current);
      if (remainingMs <= 0) {
        handleSignOut();
      } else if (remainingMs <= WARNING_LEAD_MS) {
        setIdleWarningSecondsLeft(Math.ceil(remainingMs / 1000));
      } else {
        setIdleWarningSecondsLeft(null);
      }
    }, 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActive));
      clearInterval(interval);
    };
  }, [session, markActive, handleSignOut]);

  if (!checked) {
    return <div className="flex min-h-screen items-center justify-center bg-cream" />;
  }

  if (!session) {
    return <SignInForm nhost={nhost} onSignedIn={setSession} />;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "menu", label: "Ēdienkarte" },
    { id: "locations", label: "Atrašanās vietas" },
    { id: "testimonials", label: "Atsauksmes (nav aktīvs)" },
    { id: "copy", label: "Saturs" },
    { id: "settings", label: "Iestatījumi" },
  ];

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-cream px-6 py-4">
        <div>
          <p className="font-display text-lg font-bold">Tobio admin</p>
          <p className="text-xs text-ink-soft">{session.user?.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-4 py-2 text-sm font-medium hover:bg-ink/5"
        >
          <LogOut className="h-4 w-4" />
          Iziet
        </button>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-ink/10 bg-cream px-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "border-coral text-coral-dark"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {tab === "menu" && <MenuItemsAdmin nhost={nhost} />}
        {tab === "locations" && <LocationsAdmin nhost={nhost} />}
        {tab === "testimonials" && <TestimonialsAdmin nhost={nhost} />}
        {tab === "copy" && <SiteCopyAdmin nhost={nhost} />}
        {tab === "settings" && <SiteSettingsAdmin nhost={nhost} />}
      </main>

      {idleWarningSecondsLeft !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-ink/10 bg-cream p-6 text-center shadow-xl">
            <p className="font-display text-lg font-bold text-ink">Vēl esi šeit?</p>
            <p className="mt-2 text-sm text-ink-soft">
              Nekādu darbību nav bijis 29 minūtes — pēc {idleWarningSecondsLeft}{" "}
              {idleWarningSecondsLeft === 1 ? "sekundes" : "sekundēm"} tiksi automātiski izrakstīts.
              Ja kaut kur ir nesaglabātas izmaiņas, tagad ir laiks tās saglabāt.
            </p>
            <button
              type="button"
              onClick={stayLoggedIn}
              className="mt-4 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-ink"
            >
              Palikt pieteiktam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

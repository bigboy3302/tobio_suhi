"use client";

import { useEffect, useState } from "react";
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

export default function AdminPage() {
  const [nhost] = useState<NhostClient>(() => createBrowserNhost());
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");

  useEffect(() => {
    setSession(nhost.getUserSession());
    setChecked(true);
  }, [nhost]);

  async function handleSignOut() {
    const current = nhost.getUserSession();
    if (current) {
      await nhost.auth.signOut({ refreshToken: current.refreshToken }).catch(() => {});
    }
    nhost.clearSession();
    setSession(null);
  }

  if (!checked) {
    return <div className="flex min-h-screen items-center justify-center bg-cream" />;
  }

  if (!session) {
    return <SignInForm nhost={nhost} onSignedIn={setSession} />;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "menu", label: "Ēdienkarte" },
    { id: "locations", label: "Atrašanās vietas" },
    { id: "testimonials", label: "Atsauksmes" },
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
    </div>
  );
}

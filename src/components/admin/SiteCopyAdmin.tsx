"use client";

import { useEffect, useState } from "react";
import type { NhostClient } from "@nhost/nhost-js";
import { adminRequest } from "@/lib/adminGraphql";
import type { SiteCopyRow } from "@/lib/types";

const GROUPS: { title: string; keys: { key: string; label: string }[] }[] = [
  {
    title: "Hero",
    keys: [
      { key: "hero.headline", label: "Virsraksts" },
      { key: "hero.subtext", label: "Apakšvirsraksts" },
    ],
  },
  {
    title: "Kāpēc Tobio",
    keys: [
      { key: "why.eyebrow", label: "Sadaļas oznaka" },
      { key: "why.heading", label: "Virsraksts" },
      { key: "why.freshTitle", label: '"Svaigi produkti" karte — nosaukums' },
      { key: "why.freshBody", label: '"Svaigi produkti" karte — teksts' },
      { key: "why.setsTitle", label: '"Suši seti svētkiem" karte — nosaukums' },
      { key: "why.setsBody", label: '"Suši seti svētkiem" karte — teksts' },
      { key: "why.chefTitle", label: "Trešā karte — nosaukums" },
      { key: "why.chefBody", label: "Trešā karte — teksts" },
    ],
  },
  {
    title: "Mūsu stāsts",
    keys: [
      { key: "story.headline", label: "Virsraksts" },
      { key: "story.body", label: "Teksts" },
    ],
  },
  {
    title: "Roll'u konstruktors",
    keys: [
      { key: "builder.eyebrow", label: "Sadaļas oznaka" },
      { key: "builder.heading", label: "Virsraksts" },
    ],
  },
  {
    title: "Ēdienkarte",
    keys: [
      { key: "menu.eyebrow", label: "Sadaļas oznaka" },
      { key: "menu.heading", label: "Virsraksts" },
      { key: "menu.allergenNote", label: "Alergēnu brīdinājums" },
    ],
  },
  {
    title: "Atrašanās vietas",
    keys: [
      { key: "locations.eyebrow", label: "Sadaļas oznaka" },
      { key: "locations.heading", label: "Virsraksts" },
    ],
  },
  {
    title: "Atsauksmes",
    keys: [
      { key: "testimonials.eyebrow", label: "Sadaļas oznaka" },
      { key: "testimonials.heading", label: "Virsraksts" },
    ],
  },
  {
    title: "Google atsauksmju josla",
    keys: [{ key: "googleReviews.body", label: "Teksts" }],
  },
  {
    title: "Wolt josla",
    keys: [
      { key: "wolt.heading", label: "Virsraksts" },
      { key: "wolt.body", label: "Teksts" },
    ],
  },
  {
    title: "Kājene",
    keys: [{ key: "footer.tagline", label: "Sauklis" }],
  },
];

type FormState = Record<string, { lv: string; en: string }>;

export default function SiteCopyAdmin({ nhost }: { nhost: NhostClient }) {
  const [form, setForm] = useState<FormState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminRequest<{ site_copy: SiteCopyRow[] }>(
        nhost,
        `query { site_copy { key lv en } }`
      );
      const next: FormState = {};
      for (const row of data.site_copy) {
        next[row.key] = { lv: row.lv, en: row.en };
      }
      setForm(next);
    } catch (e) {
      setMessage({ type: "err", text: String(e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(key: string, lang: "lv" | "en", value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: { lv: prev[key]?.lv ?? "", en: prev[key]?.en ?? "", [lang]: value },
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const objects = Object.entries(form).map(([key, val]) => ({ key, lv: val.lv, en: val.en }));
      await adminRequest(
        nhost,
        `mutation($objects: [site_copy_insert_input!]!) {
          insert_site_copy(
            objects: $objects,
            on_conflict: {constraint: site_copy_pkey, update_columns: [lv, en]}
          ) {
            affected_rows
          }
        }`,
        { objects }
      );
      setMessage({ type: "ok", text: "Saturs saglabāts." });
    } catch (e) {
      setMessage({ type: "err", text: String(e) });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-soft">Ielādē...</p>;

  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-bold">Saturs</h2>
      <p className="mb-6 max-w-2xl text-sm text-ink-soft">
        Šeit rediģē visus vietnes virsrakstus un tekstus — gan latviešu, gan angļu valodā. Ja
        vietnē ir ieslēgts LV/EN pārslēgs, katram laukam jābūt aizpildītam abās valodās, citādi
        angļu skatītāji redzēs latviešu tekstu.
      </p>

      {message && (
        <p className={`mb-4 text-sm ${message.type === "ok" ? "text-matcha-dark" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {GROUPS.map((group) => (
          <div key={group.title} className="rounded-2xl border border-ink/10 bg-cream-soft p-5">
            <h3 className="mb-4 font-semibold text-ink">{group.title}</h3>
            <div className="space-y-4">
              {group.keys.map(({ key, label }) => (
                <div key={key} className="grid gap-2 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-medium text-ink-soft">
                      {label} — LV
                    </span>
                    <textarea
                      required
                      value={form[key]?.lv ?? ""}
                      onChange={(e) => update(key, "lv", e.target.value)}
                      rows={2}
                      className="admin-input"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-medium text-ink-soft">
                      {label} — EN
                    </span>
                    <textarea
                      required
                      value={form[key]?.en ?? ""}
                      onChange={(e) => update(key, "en", e.target.value)}
                      rows={2}
                      className="admin-input"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-ink disabled:opacity-60"
        >
          {saving ? "Saglabā..." : "Saglabāt visu"}
        </button>
      </form>
    </div>
  );
}

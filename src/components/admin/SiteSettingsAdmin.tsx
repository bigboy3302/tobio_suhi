"use client";

import { useEffect, useState } from "react";
import type { NhostClient } from "@nhost/nhost-js";
import { adminRequest } from "@/lib/adminGraphql";
import type { MenuItem, SiteSettings } from "@/lib/types";
import ImageUploadField from "./ImageUploadField";

const SETTINGS_FIELDS = `
  id hero_headline hero_subtext daily_special_manual_id roll_builder_base_price
  google_reviews_url wolt_url_sigulda wolt_url_cesis
  hero_image_id hero_image_alt story_heading story_body allergen_text
`;

export default function SiteSettingsAdmin({ nhost }: { nhost: NhostClient }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [settingsData, menuData] = await Promise.all([
        adminRequest<{ site_settings: SiteSettings[] }>(
          nhost,
          `query { site_settings(limit: 1) { ${SETTINGS_FIELDS} } }`
        ),
        adminRequest<{ menu_items: MenuItem[] }>(
          nhost,
          `query { menu_items(where: {active: {_eq: true}}, order_by: [{category: asc}, {sort_order: asc}]) { id name category } }`
        ),
      ]);
      setSettings(settingsData.site_settings[0] ?? null);
      setMenuItems(menuData.menu_items);
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await adminRequest(
        nhost,
        `mutation($id: uuid!, $input: site_settings_set_input!) {
          update_site_settings_by_pk(pk_columns: {id: $id}, _set: $input) { id }
        }`,
        {
          id: settings.id,
          input: {
            hero_headline: settings.hero_headline,
            hero_subtext: settings.hero_subtext,
            daily_special_manual_id: settings.daily_special_manual_id || null,
            roll_builder_base_price: Number(settings.roll_builder_base_price),
            google_reviews_url: settings.google_reviews_url,
            wolt_url_sigulda: settings.wolt_url_sigulda,
            wolt_url_cesis: settings.wolt_url_cesis,
            hero_image_id: settings.hero_image_id,
            hero_image_alt: settings.hero_image_id ? settings.hero_image_alt || null : null,
            story_heading: settings.story_heading || null,
            story_body: settings.story_body || null,
            allergen_text: settings.allergen_text || null,
          },
        }
      );
      setMessage({ type: "ok", text: "Iestatījumi saglabāti." });
    } catch (e) {
      setMessage({ type: "err", text: String(e) });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-soft">Ielādē...</p>;
  if (!settings) return <p className="text-sm text-red-600">site_settings ieraksts nav atrasts.</p>;

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Vietnes iestatījumi</h2>

      {message && (
        <p className={`mb-4 text-sm ${message.type === "ok" ? "text-matcha-dark" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSave} className="max-w-xl rounded-2xl border border-ink/10 bg-cream-soft p-5">
        <Field label="Hero virsraksts">
          <input
            value={settings.hero_headline}
            onChange={(e) => setSettings({ ...settings, hero_headline: e.target.value })}
            className="admin-input"
          />
        </Field>
        <Field label="Hero apakšvirsraksts">
          <textarea
            value={settings.hero_subtext}
            onChange={(e) => setSettings({ ...settings, hero_subtext: e.target.value })}
            rows={2}
            className="admin-input"
          />
        </Field>

        <ImageUploadField
          nhost={nhost}
          label="Hero fona attēls"
          imageId={settings.hero_image_id}
          imageAlt={settings.hero_image_alt ?? ""}
          onImageChange={(id) => setSettings({ ...settings, hero_image_id: id })}
          onAltChange={(alt) => setSettings({ ...settings, hero_image_alt: alt })}
        />

        <div className="mt-6 border-t border-ink/10 pt-5">
          <p className="mb-1 text-sm font-semibold text-ink">Mūsu stāsts</p>
          <p className="mb-3 text-xs text-ink-soft">
            Ja atstāsi tukšu, vietnē rādīsies noklusējuma teksts.
          </p>
          <Field label="Virsraksts">
            <input
              value={settings.story_heading ?? ""}
              onChange={(e) => setSettings({ ...settings, story_heading: e.target.value })}
              className="admin-input"
            />
          </Field>
          <Field label="Teksts">
            <textarea
              value={settings.story_body ?? ""}
              onChange={(e) => setSettings({ ...settings, story_body: e.target.value })}
              rows={3}
              className="admin-input"
            />
          </Field>
        </div>

        <div className="mt-6 border-t border-ink/10 pt-5">
          <Field label="Alergēnu brīdinājums (rādās virs ēdienkartes)">
            <textarea
              value={settings.allergen_text ?? ""}
              onChange={(e) => setSettings({ ...settings, allergen_text: e.target.value })}
              rows={2}
              className="admin-input"
            />
          </Field>
        </div>

        <Field label="Šodienas ieteikums (manuāla izvēle)">
          <select
            value={settings.daily_special_manual_id ?? ""}
            onChange={(e) =>
              setSettings({ ...settings, daily_special_manual_id: e.target.value || null })
            }
            className="admin-input"
          >
            <option value="">— Automātiski (pēc nedēļas dienas) —</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ink-soft">
            Ja neizvēlēsies neko, vietne pati rotēs pa iecienītākajiem ēdieniem pēc nedēļas dienas.
          </p>
        </Field>

        <Field label="Roll'u konstruktora bāzes cena (€)">
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.roll_builder_base_price}
            onChange={(e) =>
              setSettings({ ...settings, roll_builder_base_price: Number(e.target.value) })
            }
            className="admin-input"
          />
        </Field>

        <Field label="Google atsauksmju saite">
          <input
            value={settings.google_reviews_url}
            onChange={(e) => setSettings({ ...settings, google_reviews_url: e.target.value })}
            className="admin-input"
          />
        </Field>

        <Field label="Wolt saite — Sigulda">
          <input
            value={settings.wolt_url_sigulda}
            onChange={(e) => setSettings({ ...settings, wolt_url_sigulda: e.target.value })}
            className="admin-input"
          />
        </Field>

        <Field label="Wolt saite — Cēsis">
          <input
            value={settings.wolt_url_cesis}
            onChange={(e) => setSettings({ ...settings, wolt_url_cesis: e.target.value })}
            className="admin-input"
          />
        </Field>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 rounded-full bg-coral px-5 py-2 text-sm font-semibold text-ink disabled:opacity-60"
        >
          {saving ? "Saglabā..." : "Saglabāt"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-3 block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

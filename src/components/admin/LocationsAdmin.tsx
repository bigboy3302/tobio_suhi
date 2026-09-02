"use client";

import { useEffect, useState } from "react";
import type { NhostClient } from "@nhost/nhost-js";
import { adminRequest } from "@/lib/adminGraphql";
import type { Location } from "@/lib/types";

const FIELDS = `
  id name city address phone hours_weekdays hours_weekend rating reviews_count google_maps_url sort_order
`;

export default function LocationsAdmin({ nhost }: { nhost: NhostClient }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminRequest<{ locations: Location[] }>(
        nhost,
        `query { locations(order_by: {sort_order: asc}) { ${FIELDS} } }`
      );
      setLocations(data.locations);
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

  function update(id: string, patch: Partial<Location>) {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  async function handleSave(loc: Location) {
    setSaving(loc.id);
    try {
      await adminRequest(
        nhost,
        `mutation($id: uuid!, $input: locations_set_input!) {
          update_locations_by_pk(pk_columns: {id: $id}, _set: $input) { id }
        }`,
        {
          id: loc.id,
          input: {
            name: loc.name,
            address: loc.address,
            phone: loc.phone,
            hours_weekdays: loc.hours_weekdays,
            hours_weekend: loc.hours_weekend,
            rating: Number(loc.rating),
            reviews_count: Number(loc.reviews_count),
            google_maps_url: loc.google_maps_url,
          },
        }
      );
      setMessage({ type: "ok", text: `Saglabāts: ${loc.name}` });
    } catch (e) {
      setMessage({ type: "err", text: String(e) });
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <p className="text-sm text-ink-soft">Ielādē...</p>;

  return (
    <div>
      <h2 className="mb-2 font-display text-2xl font-bold">Atrašanās vietas</h2>
      <p className="mb-6 text-sm text-ink-soft">
        Fiksētas divas vietas — Sigulda un Cēsis. Var rediģēt, nevar pievienot/dzēst.
      </p>

      {message && (
        <p className={`mb-4 text-sm ${message.type === "ok" ? "text-matcha-dark" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {locations.map((loc) => (
          <div key={loc.id} className="rounded-2xl border border-ink/10 bg-cream-soft p-5">
            <h3 className="mb-3 font-semibold">{loc.city}</h3>

            <Field label="Nosaukums">
              <input
                value={loc.name}
                onChange={(e) => update(loc.id, { name: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Adrese">
              <input
                value={loc.address}
                onChange={(e) => update(loc.id, { address: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Tālrunis">
              <input
                value={loc.phone}
                onChange={(e) => update(loc.id, { phone: e.target.value })}
                className="admin-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Darba dienās">
                <input
                  value={loc.hours_weekdays}
                  onChange={(e) => update(loc.id, { hours_weekdays: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Nedēļas nogalē">
                <input
                  value={loc.hours_weekend}
                  onChange={(e) => update(loc.id, { hours_weekend: e.target.value })}
                  className="admin-input"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Vērtējums (0-5)">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={loc.rating}
                  onChange={(e) => update(loc.id, { rating: Number(e.target.value) })}
                  className="admin-input"
                />
              </Field>
              <Field label="Atsauksmju skaits">
                <input
                  type="number"
                  min="0"
                  value={loc.reviews_count}
                  onChange={(e) => update(loc.id, { reviews_count: Number(e.target.value) })}
                  className="admin-input"
                />
              </Field>
            </div>
            <Field label="Google Maps saite">
              <input
                value={loc.google_maps_url}
                onChange={(e) => update(loc.id, { google_maps_url: e.target.value })}
                className="admin-input"
              />
            </Field>

            <button
              type="button"
              onClick={() => handleSave(loc)}
              disabled={saving === loc.id}
              className="mt-4 rounded-full bg-coral px-5 py-2 text-sm font-semibold text-ink disabled:opacity-60"
            >
              {saving === loc.id ? "Saglabā..." : "Saglabāt"}
            </button>
          </div>
        ))}
      </div>
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

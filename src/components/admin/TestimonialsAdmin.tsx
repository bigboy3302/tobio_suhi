"use client";

import { useEffect, useState } from "react";
import type { NhostClient } from "@nhost/nhost-js";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminRequest } from "@/lib/adminGraphql";
import type { Testimonial } from "@/lib/types";

const FIELDS = `id author_name location_name quote rating source active sort_order`;

type FormState = {
  id?: string;
  author_name: string;
  location_name: string;
  quote: string;
  rating: string;
  source: string;
  active: boolean;
  sort_order: string;
};

const EMPTY_FORM: FormState = {
  author_name: "",
  location_name: "",
  quote: "",
  rating: "5",
  source: "direct",
  active: true,
  sort_order: "0",
};

export default function TestimonialsAdmin({ nhost }: { nhost: NhostClient }) {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminRequest<{ testimonials: Testimonial[] }>(
        nhost,
        `query { testimonials(order_by: {sort_order: asc}) { ${FIELDS} } }`
      );
      setItems(data.testimonials);
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

  function startEdit(t: Testimonial) {
    setForm({
      id: t.id,
      author_name: t.author_name,
      location_name: t.location_name,
      quote: t.quote,
      rating: String(t.rating),
      source: t.source || "direct",
      active: t.active,
      sort_order: String(t.sort_order),
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const input = {
      author_name: form.author_name,
      location_name: form.location_name || null,
      quote: form.quote,
      rating: Number(form.rating),
      source: form.source,
      active: form.active,
      sort_order: Number(form.sort_order),
    };
    try {
      if (form.id) {
        await adminRequest(
          nhost,
          `mutation($id: uuid!, $input: testimonials_set_input!) {
            update_testimonials_by_pk(pk_columns: {id: $id}, _set: $input) { id }
          }`,
          { id: form.id, input }
        );
      } else {
        await adminRequest(
          nhost,
          `mutation($input: testimonials_insert_input!) {
            insert_testimonials_one(object: $input) { id }
          }`,
          { input }
        );
      }
      setMessage({ type: "ok", text: `Saglabāts: ${form.author_name}` });
      setForm(null);
      load();
    } catch (e) {
      setMessage({ type: "err", text: String(e) });
    }
  }

  async function handleDelete(t: Testimonial) {
    if (!confirm(`Dzēst atsauksmi no "${t.author_name}"?`)) return;
    try {
      await adminRequest(
        nhost,
        `mutation($id: uuid!) { delete_testimonials_by_pk(id: $id) { id } }`,
        { id: t.id }
      );
      setMessage({ type: "ok", text: "Dzēsts." });
      load();
    } catch (e) {
      setMessage({ type: "err", text: String(e) });
    }
  }

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Šī cilne vairs neietekmē vietni.</p>
        <p className="mt-1">
          Atsauksmju sadaļa vietnē tagad rāda reālas Google atsauksmes tieši no jūsu Google Business
          profila, nevis šeit ievadītās. Šie ieraksti paliek datubāzē, bet vairs netiek rādīti
          publiskajā vietnē — droši var ignorēt vai dzēst.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Atsauksmes (nav aktīvs) ({items.length})</h2>
        <button
          type="button"
          onClick={() => setForm(EMPTY_FORM)}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream"
        >
          <Plus className="h-4 w-4" />
          Pievienot
        </button>
      </div>

      {message && (
        <p className={`mb-4 text-sm ${message.type === "ok" ? "text-matcha-dark" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      {form && (
        <form onSubmit={handleSave} className="mb-8 rounded-2xl border border-ink/10 bg-cream-soft p-5">
          <h3 className="mb-4 font-semibold">{form.id ? "Rediģēt atsauksmi" : "Jauna atsauksme"}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Vārds">
              <input
                required
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Atrašanās vieta">
              <input
                value={form.location_name}
                onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Vērtējums (1-5)">
              <input
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Avots">
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="admin-input"
              >
                <option value="google">Google</option>
                <option value="facebook">Facebook</option>
                <option value="direct">Tieši</option>
              </select>
            </Field>
          </div>
          <Field label="Atsauksmes teksts">
            <textarea
              required
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              rows={3}
              className="admin-input"
            />
          </Field>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Aktīva (redzama vietnē)
          </label>
          <div className="mt-5 flex gap-2">
            <button type="submit" className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-ink">
              Saglabāt
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-full border border-ink/20 px-5 py-2 text-sm font-medium"
            >
              Atcelt
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink-soft">Ielādē...</p>
      ) : (
        <div className="divide-y divide-ink/10 rounded-2xl border border-ink/10">
          {items.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {t.author_name}
                  {!t.active && (
                    <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] text-ink-soft">
                      neaktīva
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-ink-soft">{t.quote}</p>
              </div>
              <div className="flex flex-none gap-1.5">
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  className="rounded-full p-2 hover:bg-ink/5"
                  aria-label="Rediģēt"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t)}
                  className="rounded-full p-2 text-red-600 hover:bg-red-50"
                  aria-label="Dzēst"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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

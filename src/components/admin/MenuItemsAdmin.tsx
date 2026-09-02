"use client";

import { useEffect, useState } from "react";
import type { NhostClient } from "@nhost/nhost-js";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminRequest } from "@/lib/adminGraphql";
import {
  CATEGORY_LABELS,
  TAG_LABELS,
  type MenuCategory,
  type MenuItem,
  type MenuTag,
} from "@/lib/types";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as MenuCategory[];
const TAGS = Object.keys(TAG_LABELS) as MenuTag[];

const FIELDS = `
  id name description price price_large size_small_label size_large_label
  category tags active sort_order
`;

type FormState = {
  id?: string;
  name: string;
  description: string;
  price: string;
  price_large: string;
  size_small_label: string;
  size_large_label: string;
  category: MenuCategory;
  tags: MenuTag[];
  active: boolean;
  sort_order: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  price_large: "",
  size_small_label: "",
  size_large_label: "",
  category: "susi_seti",
  tags: [],
  active: true,
  sort_order: "0",
};

export default function MenuItemsAdmin({ nhost }: { nhost: NhostClient }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminRequest<{ menu_items: MenuItem[] }>(
        nhost,
        `query { menu_items(order_by: [{category: asc}, {sort_order: asc}]) { ${FIELDS} } }`
      );
      setItems(data.menu_items);
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

  function startEdit(item: MenuItem) {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: String(item.price),
      price_large: item.price_large != null ? String(item.price_large) : "",
      size_small_label: item.size_small_label ?? "",
      size_large_label: item.size_large_label ?? "",
      category: item.category,
      tags: item.tags ?? [],
      active: item.active,
      sort_order: String(item.sort_order),
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const input = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      price_large: form.price_large ? Number(form.price_large) : null,
      size_small_label: form.size_small_label || null,
      size_large_label: form.size_large_label || null,
      category: form.category,
      tags: form.tags,
      active: form.active,
      sort_order: Number(form.sort_order),
    };
    try {
      if (form.id) {
        await adminRequest(
          nhost,
          `mutation($id: uuid!, $input: menu_items_set_input!) {
            update_menu_items_by_pk(pk_columns: {id: $id}, _set: $input) { id }
          }`,
          { id: form.id, input }
        );
        setMessage({ type: "ok", text: `Saglabāts: ${form.name}` });
      } else {
        await adminRequest(
          nhost,
          `mutation($input: menu_items_insert_input!) {
            insert_menu_items_one(object: $input) { id }
          }`,
          { input }
        );
        setMessage({ type: "ok", text: `Pievienots: ${form.name}` });
      }
      setForm(null);
      load();
    } catch (e) {
      setMessage({ type: "err", text: String(e) });
    }
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Dzēst "${item.name}"?`)) return;
    try {
      await adminRequest(
        nhost,
        `mutation($id: uuid!) { delete_menu_items_by_pk(id: $id) { id } }`,
        { id: item.id }
      );
      setMessage({ type: "ok", text: `Dzēsts: ${item.name}` });
      load();
    } catch (e) {
      setMessage({ type: "err", text: String(e) });
    }
  }

  function toggleTag(tag: MenuTag) {
    if (!form) return;
    setForm({
      ...form,
      tags: form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag],
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Ēdienkartes pozīcijas ({items.length})</h2>
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
        <form
          onSubmit={handleSave}
          className="mb-8 rounded-2xl border border-ink/10 bg-cream-soft p-5"
        >
          <h3 className="mb-4 font-semibold">{form.id ? "Rediģēt pozīciju" : "Jauna pozīcija"}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nosaukums">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Kategorija">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as MenuCategory })}
                className="admin-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cena (€)">
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Cena — lielākajam izmēram (€, ja attiecas)">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price_large}
                onChange={(e) => setForm({ ...form, price_large: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Mazā izmēra etiķete (piem. 8 gab.)">
              <input
                value={form.size_small_label}
                onChange={(e) => setForm({ ...form, size_small_label: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Lielā izmēra etiķete (piem. 16 gab.)">
              <input
                value={form.size_large_label}
                onChange={(e) => setForm({ ...form, size_large_label: e.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Kārtas numurs">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="admin-input"
              />
            </Field>
            <label className="mt-6 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Aktīvs (redzams ēdienkartē)
            </label>
          </div>

          <Field label="Apraksts">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="admin-input"
            />
          </Field>

          <div className="mt-3">
            <p className="mb-1.5 text-sm font-medium text-ink">Tagi</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    form.tags.includes(tag) ? "bg-ink text-cream" : "bg-ink/10 text-ink-soft"
                  }`}
                >
                  {TAG_LABELS[tag]}
                </button>
              ))}
            </div>
          </div>

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
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {item.name}
                  {!item.active && (
                    <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] text-ink-soft">
                      neaktīvs
                    </span>
                  )}
                </p>
                <p className="text-xs text-ink-soft">
                  {CATEGORY_LABELS[item.category]} &middot; &euro;{item.price.toFixed(2)}
                  {item.price_large ? ` / €${item.price_large.toFixed(2)}` : ""}
                </p>
              </div>
              <div className="flex flex-none gap-1.5">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-full p-2 hover:bg-ink/5"
                  aria-label="Rediģēt"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
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

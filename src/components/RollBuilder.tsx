"use client";

import { useMemo, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { RollBuilderOption } from "@/lib/types";

const CATEGORY_TITLES: Record<string, string> = {
  rice: "1. Izvēlies rīsus",
  protein: "2. Izvēlies olbaltumvielu",
  extra: "3. Pievieno piedevas",
};

export default function RollBuilder({
  options,
  basePrice,
}: {
  options: RollBuilderOption[];
  basePrice: number;
}) {
  const rice = options.filter((o) => o.category === "rice");
  const protein = options.filter((o) => o.category === "protein");
  const extra = options.filter((o) => o.category === "extra");

  const [riceId, setRiceId] = useState(rice[0]?.id ?? "");
  const [proteinId, setProteinId] = useState(protein[0]?.id ?? "");
  const [extraIds, setExtraIds] = useState<string[]>([]);

  const total = useMemo(() => {
    const riceOpt = rice.find((o) => o.id === riceId);
    const proteinOpt = protein.find((o) => o.id === proteinId);
    const extrasSum = extra
      .filter((o) => extraIds.includes(o.id))
      .reduce((sum, o) => sum + o.price, 0);
    return basePrice + (riceOpt?.price ?? 0) + (proteinOpt?.price ?? 0) + extrasSum;
  }, [rice, protein, extra, riceId, proteinId, extraIds, basePrice]);

  function toggleExtra(id: string) {
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  }

  if (rice.length === 0 && protein.length === 0) return null;

  return (
    <section id="roll-builder" className="bg-ink py-20 text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-coral">
            Interaktīvi
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Uztaisi savu roll&apos;u
          </h2>
          <p className="mt-2 text-sm text-cream/70">
            Izvēlies katru sastāvdaļu un vēro, kā cena mainās reāllaikā.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-start">
          <OptionGroup
            title={CATEGORY_TITLES.rice}
            options={rice}
            selected={[riceId]}
            onSelect={(id) => setRiceId(id)}
          />
          <OptionGroup
            title={CATEGORY_TITLES.protein}
            options={protein}
            selected={[proteinId]}
            onSelect={(id) => setProteinId(id)}
          />
          <OptionGroup
            title={CATEGORY_TITLES.extra}
            options={extra}
            selected={extraIds}
            onSelect={toggleExtra}
            multi
          />

          <div className="rounded-3xl bg-cream p-6 text-ink lg:w-64">
            <div className="flex items-center gap-2 text-coral-dark">
              <ShoppingBag className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-wide">Tavs roll&apos;is</p>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">&euro;{total.toFixed(2)}</p>
            <p className="mt-1 text-xs text-ink-soft">
              Bāzes cena &euro;{basePrice.toFixed(2)} + izvēlētās sastāvdaļas
            </p>
            <a
              href="#atrasanas-vietas"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
            >
              Pasūtīt šo roll&apos;u
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function OptionGroup({
  title,
  options,
  selected,
  onSelect,
  multi,
}: {
  title: string;
  options: RollBuilderOption[];
  selected: string[];
  onSelect: (id: string) => void;
  multi?: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-cream/85">{title}</h3>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              aria-pressed={isSelected}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? "border-coral bg-coral/15 text-cream"
                  : "border-cream/15 text-cream/75 hover:border-cream/40"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border ${
                    isSelected ? "border-coral bg-coral" : "border-cream/40"
                  } ${multi ? "rounded" : ""}`}
                >
                  {isSelected && <Check className="h-3 w-3 text-cream" strokeWidth={3} />}
                </span>
                {opt.name}
              </span>
              <span className="whitespace-nowrap text-xs font-semibold text-cream/70">
                {opt.price > 0 ? `+€${opt.price.toFixed(2)}` : "iekļauts"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

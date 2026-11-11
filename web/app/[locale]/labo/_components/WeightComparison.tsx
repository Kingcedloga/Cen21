"use client";

import { useState } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";

// `!` obligatoire : les règles h1–h4 de globals.css sont hors des couches
// Tailwind et l'emportent sur les utilitaires (graisse et interlettrage).
const WEIGHTS = [
  { value: 700, className: "font-bold!" },
  { value: 600, className: "font-semibold!" },
  { value: 500, className: "font-medium!" },
] as const;

/** Même titre en mode « load » à trois graisses, rejouable. */
export function WeightComparison({
  title,
  sweep,
  replayLabel,
  labels,
}: {
  title: string;
  sweep: string;
  replayLabel: string;
  labels: Record<(typeof WEIGHTS)[number]["value"], string>;
}) {
  const [run, setRun] = useState(0);

  return (
    <div className="mt-14 flex flex-col gap-14">
      {WEIGHTS.map((weight, index) => (
        <figure key={weight.value} className="flex flex-col gap-3" data-weight={weight.value}>
          <figcaption className="font-mono text-xs uppercase tracking-[0.12em] text-rose">
            {labels[weight.value]}
          </figcaption>
          <SpectrumText
            key={`${weight.value}-${run}`}
            as="h2"
            mode="load"
            delay={index * 0.2}
            text={title}
            sweep={sweep}
            className={`max-w-5xl text-display tracking-display! text-ivory ${weight.className}`}
          />
        </figure>
      ))}
      <div>
        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          className="btn-secondary inline-flex min-h-[44px] cursor-pointer items-center rounded-xl px-6 text-sm font-medium"
        >
          {replayLabel}
        </button>
      </div>
    </div>
  );
}

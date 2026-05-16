"use client";

import { LayoutGrid, Layers, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SubsidiariesCoverFlow } from "@/components/filiales/SubsidiariesCoverFlow";
import { SubsidiaryCard } from "@/components/cards/SubsidiaryCard";
import { SECTOR_LABELS } from "@/lib/content";
import type { Sector, Subsidiary } from "@/lib/types";

type SectorFilter = Sector | "all";
type ViewMode = "coverflow" | "grid";

const SECTOR_OPTIONS: { value: SectorFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "restaurant", label: SECTOR_LABELS.restaurant },
  { value: "bar", label: SECTOR_LABELS.bar },
  { value: "lounge", label: SECTOR_LABELS.lounge },
  { value: "nightclub", label: SECTOR_LABELS.nightclub },
  { value: "evenementiel", label: SECTOR_LABELS.evenementiel },
];

export function SubsidiariesExplorer({
  subsidiaries,
}: {
  subsidiaries: Subsidiary[];
}) {
  const [sector, setSector] = useState<SectorFilter>("all");
  const [view, setView] = useState<ViewMode>("coverflow");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) {
      setView("grid");
    }
  }, []);

  const filtered = useMemo(() => {
    if (sector === "all") return subsidiaries;
    return subsidiaries.filter((s) => s.sector === sector);
  }, [sector, subsidiaries]);

  const counts = useMemo(() => {
    const out: Record<SectorFilter, number> = {
      all: subsidiaries.length,
      restaurant: 0,
      bar: 0,
      lounge: 0,
      nightclub: 0,
      evenementiel: 0,
    };
    for (const s of subsidiaries) out[s.sector] += 1;
    return out;
  }, [subsidiaries]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div
          role="tablist"
          aria-label="Filtrer par secteur"
          className="flex flex-wrap gap-2"
        >
          {SECTOR_OPTIONS.map((opt) => {
            const isActive = sector === opt.value;
            const count = counts[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSector(opt.value)}
                disabled={count === 0}
                className={`group inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                  isActive
                    ? "border-gold bg-gold text-petrol shadow-md shadow-black/30"
                    : "border-white/15 bg-petrol/40 text-ivory/80 hover:border-gold/50 hover:text-gold"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  aria-hidden
                  className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums ${
                    isActive
                      ? "bg-petrol/20 text-petrol"
                      : "bg-white/10 text-ivory/70 group-hover:bg-gold/20 group-hover:text-gold"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Type d'affichage"
          className="inline-flex shrink-0 items-center rounded-full border border-white/15 bg-petrol/40 p-1"
        >
          <ViewButton
            active={view === "coverflow"}
            onClick={() => setView("coverflow")}
            label="Vue cinétique"
            icon={Layers}
          />
          <ViewButton
            active={view === "grid"}
            onClick={() => setView("grid")}
            label="Vue grille"
            icon={LayoutGrid}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : view === "coverflow" ? (
        <div className="relative z-10 mt-10 md:mt-16 lg:mt-20">
          <SubsidiariesCoverFlow
            key={`cf-${sector}`}
            subsidiaries={filtered}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sub) => (
            <SubsidiaryCard key={sub.slug} subsidiary={sub} />
          ))}
        </div>
      )}

      <p className="text-center text-sm text-ivory/55" aria-live="polite">
        {filtered.length} établissement{filtered.length > 1 ? "s" : ""} affiché
        {filtered.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: typeof LayoutGrid;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold ${
        active
          ? "bg-gold text-petrol shadow-md shadow-black/30"
          : "text-ivory/70 hover:bg-white/5 hover:text-gold"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.85} aria-hidden />
    </button>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-petrol/30 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-petrol/70">
        <Search className="h-5 w-5 text-gold" strokeWidth={1.75} aria-hidden />
      </div>
      <p className="font-[family-name:var(--font-cormorant)] text-2xl text-ivory">
        Aucun établissement
      </p>
      <p className="text-sm text-ivory/65">
        Aucune filiale ne correspond à ce filtre. Essayez un autre secteur.
      </p>
    </div>
  );
}

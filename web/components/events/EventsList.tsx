"use client";

import Link from "next/link";
import { CalendarClock, Clock3, Mail } from "lucide-react";
import { useMemo, useState } from "react";

import { EventCard } from "@/components/cards/EventCard";
import { Button } from "@/components/ui/Button";
import { getSubsidiaries } from "@/lib/content";
import type { EventItem } from "@/lib/types";

export function EventsList({
  events,
  showArchive = true,
  pastEvents = [],
}: {
  events: EventItem[];
  showArchive?: boolean;
  pastEvents?: EventItem[];
}) {
  const subsidiaries = getSubsidiaries();
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.subsidiarySlug === filter);
  }, [events, filter]);

  const hasPast = pastEvents.length > 0;
  const isFilterApplied = filter !== "all";

  return (
    <div>
      <div
        className="flex flex-wrap gap-2 mb-10"
        role="tablist"
        aria-label="Filtrer par établissement"
      >
        <FilterBtn
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="Tous"
        />
        {subsidiaries.map((s) => (
          <FilterBtn
            key={s.slug}
            active={filter === s.slug}
            onClick={() => setFilter(s.slug)}
            label={s.name}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <EventsEmptyState
          isFiltered={isFilterApplied}
          onReset={() => setFilter("all")}
          hasPast={hasPast}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {showArchive && pastEvents.length > 0 && (
        <section className="mt-20 pt-12 border-t border-white/10">
          <h2
            id="archives-events"
            className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-8"
          >
            Archives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EventsEmptyState({
  isFiltered,
  onReset,
  hasPast,
}: {
  isFiltered: boolean;
  onReset: () => void;
  hasPast: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-2xl border border-dashed border-white/15 bg-petrol/30 px-6 py-14 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-petrol/70 shadow-lg shadow-black/30">
        <CalendarClock className="h-7 w-7 text-gold" strokeWidth={1.5} aria-hidden />
        <span
          aria-hidden
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-anthracite ring-2 ring-petrol"
        >
          <Clock3 className="h-3 w-3 text-ivory/85" strokeWidth={1.5} aria-hidden />
        </span>
      </div>

      <div className="space-y-2">
        <p className="font-[family-name:var(--font-cormorant)] text-2xl text-ivory md:text-3xl">
          {isFiltered ? "Pas d'événement programmé" : "L'agenda se prépare"}
        </p>
        <p className="text-sm leading-relaxed text-ivory/70 md:text-base">
          {isFiltered
            ? "Cet établissement n'a pas encore publié son prochain rendez-vous."
            : "Nos prochaines soirées arrivent — restez à l'écoute, ou parcourez les éditions passées."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        {isFiltered && (
          <Button onClick={onReset} variant="secondary" type="button">
            Voir tous les événements
          </Button>
        )}
        {hasPast && (
          <Link
            href="#archives-events"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-petrol/50 px-5 py-2 text-sm font-medium text-ivory/85 transition-colors duration-200 hover:border-gold/50 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
          >
            Voir les archives
          </Link>
        )}
        <Link
          href="/contact"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-sm font-medium text-gold transition-colors duration-200 hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
        >
          <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Être averti
        </Link>
      </div>
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 ${
        active
          ? "border-gold bg-gold text-petrol"
          : "border-white/20 text-ivory/80 hover:border-gold hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}

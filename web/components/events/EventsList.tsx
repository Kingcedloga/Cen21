"use client";

import { useMemo, useState } from "react";

import { EventCard } from "@/components/cards/EventCard";
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
        <p className="text-taupe text-center py-12">
          Aucun événement à venir pour cette sélection.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {showArchive && pastEvents.length > 0 && (
        <section className="mt-20 pt-12 border-t border-white/10">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-8">
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
      className={`px-4 py-2 text-sm rounded-full border transition-colors duration-200 cursor-pointer ${
        active
          ? "bg-gold text-petrol border-gold"
          : "border-white/20 text-ivory/80 hover:border-gold"
      }`}
    >
      {label}
    </button>
  );
}

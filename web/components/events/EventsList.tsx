"use client";

import { CalendarClock, Clock3, ICON_STROKE, Mail } from "@/lib/icons";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { EventCard } from "@/components/cards/EventCard";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
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
  const locale = useLocale() as Locale;
  const t = useTranslations("events");
  const subsidiaries = getSubsidiaries(locale);
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
        aria-label={t("filterLabel")}
      >
        <FilterBtn
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={t("all")}
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
          {filtered.map((event, i) => (
            <AnimateIn key={event.id} delay={(i % 6) * 0.08}>
              <EventCard event={event} />
            </AnimateIn>
          ))}
        </div>
      )}

      {showArchive && pastEvents.length > 0 && (
        <section className="mt-20 pt-12 border-t border-white/10">
          <AnimateIn>
            <h2
              id="archives-events"
              className="font-[family-name:var(--font-dm-sans)] text-3xl font-bold text-ivory mb-8"
            >
              {t("archives")}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
            {pastEvents.map((event, i) => (
              <AnimateIn key={event.id} delay={(i % 6) * 0.08}>
                <EventCard event={event} />
              </AnimateIn>
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
  const t = useTranslations("events");
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-2xl border border-dashed border-white/15 bg-petrol/30 px-6 py-14 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-petrol/70 shadow-lg shadow-black/30">
        <CalendarClock className="h-7 w-7 text-gold" weight={ICON_STROKE} aria-hidden />
        <span
          aria-hidden
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-anthracite ring-2 ring-petrol"
        >
          <Clock3 className="h-3 w-3 text-ivory/85" weight={ICON_STROKE} aria-hidden />
        </span>
      </div>

      <div className="space-y-2">
        <p className="font-[family-name:var(--font-dm-sans)] text-2xl font-bold text-ivory md:text-3xl">
          {isFiltered ? t("emptyFilteredTitle") : t("emptyAgendaTitle")}
        </p>
        <p className="text-sm leading-relaxed text-ivory/70 md:text-base">
          {isFiltered ? t("emptyFilteredBody") : t("emptyAgendaBody")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        {isFiltered && (
          <Button onClick={onReset} variant="secondary" type="button">
            {t("viewAll")}
          </Button>
        )}
        {hasPast && (
          <Link
            href="#archives-events"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-petrol/50 px-5 py-2 text-sm font-medium text-ivory/85 transition-colors duration-fine hover:border-gold/50 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
          >
            {t("viewArchives")}
          </Link>
        )}
        <Link
          href="/contact"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-sm font-medium text-gold transition-colors duration-fine hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
        >
          <Mail className="h-4 w-4" weight={ICON_STROKE} aria-hidden />
          {t("notify")}
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
      className={`min-h-[42px] rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-fine cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 active:scale-[0.97] ${
        active
          ? "border-gold bg-gold text-petrol shadow-[0_4px_20px_-4px_rgba(212,173,101,0.5)] font-bold"
          : "border-white/15 bg-white/5 text-ivory/80 hover:border-gold/40 hover:text-gold hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

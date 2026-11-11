"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

import { RevealCard } from "@/components/motion/RevealCard";
import { RollingText } from "@/components/motion/RollingText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { useCapsuleSlot } from "@/lib/capsule-slot";
import { ArrowUpRight, LayoutGrid, LayoutList } from "@/lib/icons";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/events-agenda.css";

/** Événement prêt à afficher : dates mises en forme côté serveur (pas d'écart d'hydratation). */
export type AgendaEvent = {
  id: string;
  title: string;
  dateTime: string;
  /** « mercredi 11 novembre à 23:00 » */
  dateLabel: string;
  /** « 11 » et « mer. » : bloc de date de la liste. */
  day: string;
  weekday: string;
  /** « 2026-11 » et « novembre 2026 » : regroupement de la liste. */
  monthKey: string;
  monthLabel: string;
  location: string;
  houseSlug: string;
  image: string;
  excerpt: string;
  status: "upcoming" | "past";
  /** À venir : réserver (contact prérempli). Passé : la maison. */
  action: { href: string; label: string; ariaLabel: string; external: boolean };
};

type View = "grid" | "list";
type House = { slug: string; name: string };

function EventAction({ action, newTab, compact = false }: { action: AgendaEvent["action"]; newTab: string; compact?: boolean }) {
  const className = `agenda-action tap-press ${compact ? "agenda-action--compact" : ""}`;
  const content = (
    <>
      <RollingText text={action.label} />
      <ArrowUpRight size={14} aria-hidden="true" />
    </>
  );
  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" aria-label={`${action.ariaLabel} (${newTab})`} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={action.href} aria-label={action.ariaLabel} className={className}>
      {content}
    </Link>
  );
}

function ViewToggle({ view, onChange, compact = false }: { view: View; onChange: (view: View) => void; compact?: boolean }) {
  const t = useTranslations("events");
  return (
    <div role="group" aria-label={t("viewLabel")} className={`view-toggle ${compact ? "view-toggle--capsule" : ""}`}>
      {(["grid", "list"] as const).map((value) => {
        const Icon = value === "grid" ? LayoutGrid : LayoutList;
        const label = t(value === "grid" ? "viewGrid" : "viewList");
        return (
          <button
            key={value}
            type="button"
            aria-pressed={view === value}
            aria-label={compact ? label : undefined}
            onClick={() => onChange(value)}
            className="view-toggle__button"
          >
            <Icon size={16} aria-hidden="true" />
            {!compact && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

function AgendaGrid({ events, statusLabels, newTab }: { events: AgendaEvent[]; statusLabels: Record<AgendaEvent["status"], string>; newTab: string }) {
  return (
    <ul className="agenda-grid">
      {events.map((event, index) => (
        <li key={event.id}>
          <RevealCard index={index} className={`agenda-card agenda-card--${event.status}`}>
            <div className="agenda-card__media">
              <Image src={event.image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" />
              <span className={`agenda-card__status agenda-card__status--${event.status}`}>{statusLabels[event.status]}</span>
            </div>
            <div className="agenda-card__body">
              <time dateTime={event.dateTime} className="agenda-card__date">
                {event.dateLabel}
              </time>
              <h4 className="title-section agenda-card__title text-balance">{event.title}</h4>
              <p className="agenda-card__location">{event.location}</p>
              <p className="agenda-card__excerpt">{event.excerpt}</p>
              <EventAction action={event.action} newTab={newTab} />
            </div>
          </RevealCard>
        </li>
      ))}
    </ul>
  );
}

/** Liste par mois (en-têtes collants), ordre conservé. */
function AgendaList({ events, block, newTab }: { events: AgendaEvent[]; block: string; newTab: string }) {
  const months: { key: string; label: string; events: AgendaEvent[] }[] = [];
  for (const event of events) {
    const last = months[months.length - 1];
    if (last?.key === event.monthKey) last.events.push(event);
    else months.push({ key: event.monthKey, label: event.monthLabel, events: [event] });
  }

  return (
    <div className="agenda-months">
      {months.map((month) => (
        <section key={month.key} aria-labelledby={`${block}-${month.key}`} className="agenda-month">
          <h4 id={`${block}-${month.key}`} className="agenda-month__label">
            {month.label}
          </h4>
          <ul className="agenda-rows">
            {month.events.map((event) => (
              <li key={event.id} className={`agenda-row agenda-row--${event.status}`}>
                <div aria-hidden="true" className="agenda-row__date">
                  <span className="agenda-row__day title-display">{event.day}</span>
                  <span className="agenda-row__weekday">{event.weekday}</span>
                </div>
                <div className="agenda-row__main">
                  <p className="agenda-row__title title-section">{event.title}</p>
                  <p className="agenda-row__meta">
                    <time dateTime={event.dateTime}>{event.dateLabel}</time>
                    <span aria-hidden="true"> · </span>
                    {event.location}
                  </p>
                </div>
                <EventAction action={event.action} newTab={newTab} compact />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * Agenda complet de /evenements (refonte R3, d'après la liste d'études de
 * cas d'Orbix) : filtres par maison (la pastille glisse sous le filtre
 * actif), compteur, à venir puis archives, en grille (cartes révélées) ou en
 * liste par mois. La bascule Grille / Liste est aussi dans la capsule de
 * navigation tant que l'agenda est à l'écran. `?maison=…` présélectionne un
 * filtre (liens depuis les fiches filiales).
 */
export function EventsAgenda({
  upcoming,
  past,
  houses,
  heading,
  newTab,
}: {
  upcoming: AgendaEvent[];
  past: AgendaEvent[];
  houses: House[];
  heading: { eyebrow: string; title: string; sweep: string };
  newTab: string;
}) {
  const t = useTranslations("events");
  const tHome = useTranslations("home");
  const params = useSearchParams();
  const requested = params.get("maison");
  const [filter, setFilter] = useState(houses.some((house) => house.slug === requested) ? (requested as string) : "all");
  const [view, setView] = useState<View>("grid");
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-35% 0px -35% 0px" });
  const slot = useCapsuleSlot();

  const matches = (event: AgendaEvent) => filter === "all" || event.houseSlug === filter;
  const shownUpcoming = upcoming.filter(matches);
  const shownPast = past.filter(matches);
  const statusLabels = { upcoming: tHome("eventsStatusUpcoming"), past: tHome("eventsStatusPast") };

  // Changement de vue depuis le bas de l'agenda : on revient à son en-tête.
  const changeView = (next: View) => {
    setView(next);
    const section = sectionRef.current;
    if (section && section.getBoundingClientRect().top < 0) {
      section.scrollIntoView({ block: "start" });
    }
  };

  const blocks = [
    {
      key: "upcoming",
      title: t("upcomingHeading"),
      events: shownUpcoming,
      empty: filter === "all" ? t("emptyAgendaBody") : t("emptyFilteredBody"),
    },
    { key: "archives", title: t("archives"), events: shownPast, empty: null },
  ];

  return (
    <section ref={sectionRef} id="agenda" aria-labelledby="agenda-title" data-surface="dark" className="agenda">
      <div className="mx-auto max-w-[min(100%,1400px)]">
        <div className="agenda__head">
          <SectionHeading
            look="editorial"
            eyebrow={heading.eyebrow}
            title={heading.title}
            sweep={heading.sweep}
            titleAs="h2"
            titleId="agenda-title"
            align="left"
            className="mb-0!"
          />
          <ViewToggle view={view} onChange={changeView} />
        </div>

        <div role="group" aria-label={t("filterLabel")} className="agenda__filters">
          {[{ slug: "all", name: t("all") }, ...houses].map((house) => {
            const active = filter === house.slug;
            return (
              <button
                key={house.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(house.slug)}
                className="agenda-filter tap-press"
              >
                {active && (
                  <motion.span
                    layoutId="agenda-filter-pill"
                    aria-hidden="true"
                    className="agenda-filter__pill"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative">{house.name}</span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="agenda__count">
          {t("resultCount", { count: shownUpcoming.length + shownPast.length })}
        </p>

        {blocks.map((block) =>
          block.events.length === 0 && !block.empty ? null : (
            <div key={block.key} id={block.key === "archives" ? "archives-events" : undefined} className="agenda-block">
              <h3 className="agenda-block__title">
                {block.title}
                <span className="agenda-block__count">{block.events.length}</span>
              </h3>
              {block.events.length === 0 ? (
                <p className="agenda-block__empty">{block.empty}</p>
              ) : view === "grid" ? (
                <AgendaGrid events={block.events} statusLabels={statusLabels} newTab={newTab} />
              ) : (
                <AgendaList events={block.events} block={block.key} newTab={newTab} />
              )}
            </div>
          ),
        )}
      </div>

      {/* Même bascule dans la capsule, tant que l'agenda occupe l'écran. */}
      {slot && inView && createPortal(<ViewToggle view={view} onChange={changeView} compact />, slot)}
    </section>
  );
}

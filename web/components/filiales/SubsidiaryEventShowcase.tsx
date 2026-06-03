"use client";

import Image from "next/image";
import { Ticket } from "lucide-react";
import { useLocale } from "next-intl";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { EventItem, EventStatus } from "@/lib/types";

import "@/styles/subsidiary-event-showcase.css";

type Labels = {
  bookNow: string;
  eventInfo: string;
  viewAllEvents: string;
  statusUpcoming: string;
  statusSoldOut: string;
  statusVip: string;
};

type Props = {
  events: EventItem[];
  labels: Labels;
  desktopColumns?: number;
};

function formatEventParts(iso: string, locale: Locale) {
  const date = new Date(iso);
  const loc = locale === "fr" ? "fr-FR" : "en-GB";
  return {
    dateLine: new Intl.DateTimeFormat(loc, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
    weekday: new Intl.DateTimeFormat(loc, { weekday: "long" }).format(date),
    time: new Intl.DateTimeFormat(loc, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  };
}

function displayTitle(event: EventItem): string {
  if (event.displayTitle?.trim()) return event.displayTitle.trim();
  return event.title.split("—")[0]?.split(" - ")[0]?.trim() ?? event.title;
}

function statusLabel(status: EventStatus | undefined, labels: Labels): string | null {
  if (status === "sold-out") return labels.statusSoldOut;
  if (status === "vip") return labels.statusVip;
  return null;
}

export function SubsidiaryEventShowcase({ events, labels, desktopColumns }: Props) {
  const locale = useLocale() as Locale;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(events[0]?.id ?? null);
  const colsClass =
    desktopColumns && desktopColumns > 0
      ? ` subsidiary-event-showcase--cols-${desktopColumns}`
      : "";

  if (events.length === 0) return null;

  return (
    <section
      className={`subsidiary-event-showcase${colsClass}`}
      aria-label={labels.eventInfo}
    >
      <div ref={trackRef} className="subsidiary-event-showcase__track">
        {events.map((event) => {
          const parts = formatEventParts(event.date, locale);
          const title = displayTitle(event);
          const badge = statusLabel(event.status, labels);
          const isActive = activeId === event.id;
          const isSoldOut = event.status === "sold-out";

          return (
            <article
              key={event.id}
              className={`subsidiary-event-showcase__card${isActive ? " is-active" : ""}`}
              onMouseEnter={() => setActiveId(event.id)}
              onFocus={() => setActiveId(event.id)}
            >
              <div className="subsidiary-event-showcase__visual">
                <Image
                  src={event.image}
                  alt={title}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_PETROL}
                  className="subsidiary-event-showcase__image"
                  sizes="(max-width: 640px) 78vw, 320px"
                />

                {badge && (
                  <span
                    className={`subsidiary-event-showcase__status subsidiary-event-showcase__status--${event.status ?? "upcoming"}`}
                  >
                    {badge}
                  </span>
                )}

                <div className="subsidiary-event-showcase__overlay" aria-hidden>
                  <div className="subsidiary-event-showcase__actions">
                    <Button
                      href="/contact"
                      variant="primary"
                      size="sm"
                      className="subsidiary-event-showcase__btn-book"
                      ariaLabel={labels.bookNow}
                      disabled={isSoldOut}
                    >
                      <Ticket className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                      {labels.bookNow}
                    </Button>
                    <Button
                      href="/evenements"
                      variant="secondary"
                      size="sm"
                      className="subsidiary-event-showcase__btn-info"
                    >
                      {labels.eventInfo}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="subsidiary-event-showcase__meta">
                <h3 className="subsidiary-event-showcase__title">{title}</h3>
                <time className="subsidiary-event-showcase__date" dateTime={event.date}>
                  {parts.dateLine}
                </time>
                <p className="subsidiary-event-showcase__weekday">{parts.weekday}</p>
                <p className="subsidiary-event-showcase__time">{parts.time}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="subsidiary-event-showcase__footer">
        <Link href="/evenements" className="subsidiary-event-showcase__all-link">
          {labels.viewAllEvents}
        </Link>
      </div>
    </section>
  );
}

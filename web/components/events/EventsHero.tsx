"use client";

import { useEffect, useState } from "react";

import { EventsNewsletter, type NewsletterLabels } from "@/components/events/EventsNewsletter";
import { InnerHero, type InnerHeroBreadcrumb } from "@/components/sections/InnerHero";
import { Button } from "@/components/ui/Button";
import { useHydrated } from "@/lib/use-media-query";

export type HeroEvent = {
  title: string;
  /** Date et lieu, déjà mis en forme. */
  details: string;
  dateTime: string;
  image: string;
  /** Réservation préremplie (`/contact?besoin=reservation&maison=…`). */
  reserve: { href: string; label: string };
};

type Labels = NewsletterLabels & {
  eyebrow: string;
  nextEyebrow: string;
  /** Sans rendez-vous à venir : « L'agenda se prépare ». */
  emptyTitle: string;
  emptyDescription: string;
  countdownLabel: string;
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;
};

function remainingParts(target: string) {
  const total = Math.max(0, Math.floor((new Date(target).getTime() - Date.now()) / 1000));
  return [Math.floor(total / 86400), Math.floor((total % 86400) / 3600), Math.floor((total % 3600) / 60), total % 60];
}

/**
 * Compte à rebours. L'heure courante diffère entre le serveur et le client :
 * les chiffres n'apparaissent qu'après l'hydratation (tirets avant).
 */
function Countdown({ target, labels }: { target: string; labels: Labels }) {
  const hydrated = useHydrated();
  const [, tick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => tick((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = hydrated ? remainingParts(target) : null;
  const units = [labels.daysLabel, labels.hoursLabel, labels.minutesLabel, labels.secondsLabel];

  return (
    <div
      role="timer"
      aria-label={labels.countdownLabel}
      className="grid w-full max-w-[25rem] grid-cols-4 gap-2 sm:gap-3"
    >
      {units.map((unit, index) => (
        <div
          key={unit}
          className="flex min-w-0 flex-col items-center rounded-card-md border border-rose/25 bg-petrol-panel-3/70 px-1 py-3"
        >
          <span className="title-display text-3xl tabular-nums text-ivory sm:text-4xl">
            {parts ? String(parts[index]).padStart(2, "0") : "––"}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-rose sm:text-[11px] sm:tracking-[0.18em]">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Hero de /evenements (refontes R0 et R3) : gabarit des pages intérieures.
 * S'il y a un rendez-vous à venir, il passe à l'affiche avec son compte à
 * rebours et « Réserver » (formulaire de contact prérempli) ; l'inscription
 * à l'agenda est alors en bas de page. Sinon : « L'agenda se prépare » et
 * l'inscription.
 */
export function EventsHero({
  nextEvent,
  fallbackImage,
  breadcrumb,
  labels,
  className,
}: {
  nextEvent: HeroEvent | null;
  fallbackImage: string;
  breadcrumb: InnerHeroBreadcrumb;
  labels: Labels;
  className?: string;
}) {
  return (
    <InnerHero
      className={className}
      eyebrow={nextEvent ? labels.nextEyebrow : labels.eyebrow}
      title={nextEvent?.title ?? labels.emptyTitle}
      description={nextEvent?.details ?? labels.emptyDescription}
      image={nextEvent?.image ?? fallbackImage}
      breadcrumb={breadcrumb}
    >
      {nextEvent ? (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          <Countdown target={nextEvent.dateTime} labels={labels} />
          <Button href={nextEvent.reserve.href} magnetic className="self-start lg:self-auto">
            {nextEvent.reserve.label}
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      ) : (
        <EventsNewsletter labels={labels} />
      )}
    </InnerHero>
  );
}

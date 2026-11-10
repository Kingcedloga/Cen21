"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { InnerHero, type InnerHeroBreadcrumb } from "@/components/sections/InnerHero";
import { useHydrated } from "@/lib/use-media-query";

export type HeroEvent = {
  title: string;
  /** Date et lieu, déjà mis en forme. */
  details: string;
  dateTime: string;
  image: string;
};

type Labels = {
  eyebrow: string;
  nextEyebrow: string;
  title: string;
  description: string;
  countdownLabel: string;
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;
  subscribeText: string;
  emailPlaceholder: string;
  subscribeCta: string;
  subscribing: string;
  subscribeSuccess: string;
  subscribeError: string;
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
          className="flex min-w-0 flex-col items-center rounded-card-md border border-gold/25 bg-petrol-panel-3/70 px-1 py-3"
        >
          <span className="title-display text-3xl tabular-nums text-ivory sm:text-4xl">
            {parts ? String(parts[index]).padStart(2, "0") : "––"}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold sm:text-[11px] sm:tracking-[0.18em]">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

function Subscribe({ labels }: { labels: Labels }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = emailRef.current?.value.trim();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter",
          email,
          subject: "Newsletter — Événements",
          message: "Nouvelle inscription à la newsletter événements.",
          website: "",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md">
      <p className="text-sm font-medium text-ivory/80">{labels.subscribeText}</p>
      <form
        onSubmit={onSubmit}
        className="mt-3 flex items-center rounded-full border border-gold/35 bg-petrol-panel-3/70 p-1.5 focus-within:border-gold/70"
      >
        <label htmlFor="events-newsletter-email" className="sr-only">
          {labels.emailPlaceholder}
        </label>
        <input
          ref={emailRef}
          id="events-newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder={labels.emailPlaceholder}
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/50 focus:outline-none sm:text-base"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary min-h-11 shrink-0 cursor-pointer px-5 text-xs font-bold uppercase tracking-wider disabled:opacity-70"
        >
          {status === "loading" ? labels.subscribing : labels.subscribeCta}
        </button>
      </form>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-gold">
        {status === "success" ? labels.subscribeSuccess : status === "error" ? labels.subscribeError : ""}
      </p>
    </div>
  );
}

/**
 * Hero de /evenements (refonte R0) : gabarit des pages intérieures. S'il y a
 * un rendez-vous à venir, il passe à l'affiche avec son compte à rebours ;
 * sinon, le titre de la page. Inscription à la newsletter dans les deux cas.
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
      title={nextEvent?.title ?? labels.title}
      description={nextEvent?.details ?? labels.description}
      image={nextEvent?.image ?? fallbackImage}
      breadcrumb={breadcrumb}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        {nextEvent && <Countdown target={nextEvent.dateTime} labels={labels} />}
        <Subscribe labels={labels} />
      </div>
    </InnerHero>
  );
}

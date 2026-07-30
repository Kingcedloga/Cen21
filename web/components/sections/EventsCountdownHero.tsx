"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import { resolveEventImage } from "@/lib/event-images";
import { DURATION_S, EASE } from "@/lib/motion";
import type { EventItem } from "@/lib/types";

const AUTOPLAY_MS = 6000;

type Labels = {
  comingSoonFallback: string;
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

type Props = {
  events: EventItem[];
  fallbackImage: string;
  labels: Labels;
};

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function computeRemaining(targetDate: string): Remaining {
  const diffMs = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Force un re-render chaque seconde ; `computeRemaining` est recalculé au rendu (pas de setState synchrone dans l'effet). */
function useCountdown(targetDate: string | null): Remaining {
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!targetDate) return;
    const id = window.setInterval(() => forceTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  return targetDate ? computeRemaining(targetDate) : { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col items-center">
      <div className="overflow-hidden text-5xl font-bold text-white md:text-6xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="inline-block tabular-nums"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: DURATION_S.fine, ease: EASE.luxury }}
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        {label}
      </p>
    </div>
  );
}

export function EventsCountdownHero({ events, fallbackImage, labels }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("events");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const emailRef = useRef<HTMLInputElement>(null);

  const hasEvents = events.length > 0;
  const activeEvent = hasEvents ? events[activeIndex] : null;

  useEffect(() => {
    if (!hasEvents || events.length < 2 || isHovered) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % events.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [hasEvents, events.length, isHovered]);

  const remaining = useCountdown(activeEvent?.date ?? null);

  const handleSubscribe = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
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
        event.currentTarget.reset();
      } catch {
        setStatus("error");
      }
    },
    [],
  );

  const title = activeEvent
    ? (activeEvent.displayTitle?.trim() || activeEvent.title)
    : labels.comingSoonFallback;

  const backgroundImage = activeEvent ? resolveEventImage(activeEvent, fallbackImage) : fallbackImage;

  return (
    <section
      aria-label={title}
      className="relative isolate flex h-screen min-h-[36rem] w-full items-center justify-center overflow-hidden bg-petrol"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: DURATION_S.luxe, ease: EASE.luxury }}
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div aria-hidden className="absolute inset-0 bg-[rgba(0,0,0,0.60)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${activeIndex}`}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -20 }}
            transition={{ duration: DURATION_S.base, ease: EASE.luxury }}
            className="text-5xl font-extrabold leading-[1.05] text-white md:text-7xl"
          >
            {title}
          </motion.h1>
        </AnimatePresence>

        {activeEvent && (
          <div className="mt-8 flex items-start justify-center gap-4 md:gap-8">
            <CountdownDigit value={remaining.days} label={labels.daysLabel} />
            <span className="mt-1 text-4xl font-bold text-white md:text-5xl">:</span>
            <CountdownDigit value={remaining.hours} label={labels.hoursLabel} />
            <span className="mt-1 text-4xl font-bold text-white md:text-5xl">:</span>
            <CountdownDigit value={remaining.minutes} label={labels.minutesLabel} />
            <span className="mt-1 text-4xl font-bold text-white md:text-5xl">:</span>
            <CountdownDigit value={remaining.seconds} label={labels.secondsLabel} />
          </div>
        )}

        <div className="mt-8 h-px w-full max-w-md bg-white/30" />

        <motion.div
          className="mt-8 w-full max-w-lg"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION_S.base, ease: EASE.luxury, delay: 0.2 }}
        >
          <p className="text-white/80">{labels.subscribeText}</p>
          <form onSubmit={handleSubscribe} className="mt-4 flex w-full flex-col gap-3 sm:flex-row">
            <label htmlFor="events-newsletter-email" className="sr-only">
              {labels.emailPlaceholder}
            </label>
            <input
              ref={emailRef}
              id="events-newsletter-email"
              type="email"
              required
              placeholder={labels.emailPlaceholder}
              className="min-w-0 flex-1 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 bg-gold-mid px-6 py-3 font-semibold text-white transition-colors duration-fine ease-luxury hover:bg-gold-deep disabled:opacity-70"
            >
              {status === "loading" ? labels.subscribing : labels.subscribeCta}
            </button>
          </form>
          {status === "success" && (
            <p className="mt-3 text-sm text-white/90">{labels.subscribeSuccess}</p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-300">{labels.subscribeError}</p>
          )}
        </motion.div>
      </div>

      {events.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-10 flex items-center justify-center gap-2">
          {events.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={t("hero.slidePagination", { index: i + 1 })}
              aria-current={i === activeIndex}
              className={`h-2 rounded-full transition-all duration-fine ease-luxury ${
                i === activeIndex ? "w-6 bg-gold-mid" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

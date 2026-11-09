"use client";

import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Button } from "@/components/ui/Button";
import { easeInOutCubic, TRACK_VH } from "@/lib/motion";

import "@/styles/home-events-deck.css";

export type DeckEvent = {
  id: string;
  title: string;
  /** Date déjà formatée côté serveur (pas d'écart d'hydratation). */
  dateLabel: string;
  dateTime: string;
  location: string;
  excerpt: string;
  image: string;
  status: "upcoming" | "past";
};

/** Pause de chaque carte avant qu'elle se décolle (Orbix : 18 %). */
const HOLD = 0.18;
/** Course supplémentaire de la carte qui s'envole (hauteur du titre au-dessus de la pile). */
const EXIT_VH = 40;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Part du décollage de la carte `index` (0 → 1), sur une piste de `count` cartes. */
function leaveOf(progress: number, index: number, count: number): number {
  if (index >= count - 1) return 0;
  const position = progress * (count - 1 + HOLD);
  return easeInOutCubic(clamp01((position - index - HOLD) / (1 - HOLD)));
}

/** Rang sous la carte active (0 = active), continu pendant les transitions. */
function depthOf(progress: number, index: number, count: number): number {
  let gone = 0;
  for (let i = 0; i < index; i += 1) gone += leaveOf(progress, i, count);
  return Math.max(0, index - gone);
}

function DeckCard({
  event,
  index,
  count,
  progress,
  isStatic,
  hidden,
  statusLabel,
}: {
  event: DeckEvent;
  index: number;
  count: number;
  progress: MotionValue<number>;
  isStatic: boolean;
  hidden: boolean;
  statusLabel: string;
}) {
  // Orbix : carte active yPercent 0 → −130 ; dessous, y = d × 34 − d(d − 1) × 2,
  // échelle max(.74, 1 − .06d). La pile commence sous le titre : la carte
  // décollée monte en plus de la hauteur de ce titre (EXIT_VH) pour sortir du cadre.
  const y = useTransform(progress, (v) => {
    const depth = depthOf(v, index, count);
    const stacked = depth * 34 - depth * (depth - 1) * 2;
    const leave = leaveOf(v, index, count);
    return `calc(${(-130 * leave).toFixed(3)}% - ${(EXIT_VH * leave).toFixed(3)}vh + ${stacked.toFixed(2)}px)`;
  });
  const scale = useTransform(progress, (v) => Math.max(0.74, 1 - 0.06 * depthOf(v, index, count)));
  const opacity = useTransform(progress, (v) => clamp01(4 - depthOf(v, index, count)));

  return (
    <motion.li
      data-track-motion=""
      inert={!isStatic && hidden}
      className="deck-card shadow-long"
      style={isStatic ? undefined : { y, scale, opacity, zIndex: count - index }}
    >
      <div className="deck-card__media">
        <Image src={event.image} alt="" fill sizes="(max-width: 767px) 100vw, 40vw" className="object-cover" />
      </div>
      <div className="deck-card__body">
        <p className={`deck-card__status deck-card__status--${event.status}`}>{statusLabel}</p>
        <time dateTime={event.dateTime} className="deck-card__date">
          {event.dateLabel}
        </time>
        <h3 className="title-section text-h3 text-balance">{event.title}</h3>
        <p className="deck-card__location">{event.location}</p>
        <p className="deck-card__excerpt">{event.excerpt}</p>
      </div>
    </motion.li>
  );
}

type DeckProps = {
  eyebrow: string;
  title: string;
  titleSweep?: string;
  statusLabels: { upcoming: string; past: string };
  cta: { href: string; label: string };
  events: DeckEvent[];
};

function DeckStage({ eyebrow, title, titleSweep, statusLabels, cta, events }: DeckProps) {
  const { progress, isStatic } = useStickyTrack();
  const count = events.length;
  const [active, setActive] = useState(0);

  // Carte au premier plan : les cartes décollées à plus de moitié sont inertes.
  useMotionValueEvent(progress, "change", (v) => {
    let next = 0;
    while (next < count - 1 && leaveOf(v, next, count) > 0.5) next += 1;
    setActive((current) => (current === next ? current : next));
  });

  return (
    <div className="events-deck" data-static={isStatic ? "" : undefined}>
      <div className="events-deck__frame">
        <div className="events-deck__head">
          <div>
            <p className="eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
            <SpectrumText
              as="h2"
              id="home-events-title"
              mode="scroll"
              text={title}
              sweep={titleSweep}
              className="title-section mt-4 text-h2 text-ivory text-balance"
            />
          </div>
          <div className="flex items-center gap-6">
            {!isStatic && count > 1 && (
              <p aria-hidden="true" className="events-deck__counter">
                <span className="text-gold">{String(active + 1).padStart(2, "0")}</span>
                <span className="text-ivory/40"> / {String(count).padStart(2, "0")}</span>
              </p>
            )}
            <Button href={cta.href} variant="secondary" magnetic>
              {cta.label}
            </Button>
          </div>
        </div>

        <ol className="events-deck__pile">
          {events.map((event, index) => (
            <DeckCard
              key={event.id}
              event={event}
              index={index}
              count={count}
              progress={progress}
              isStatic={isStatic}
              hidden={index < active}
              statusLabel={statusLabels[event.status]}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * Agenda en pile qui se décolle (Orbix : études de cas, piste de
 * (n − 1) × 120 vh) : la carte du dessus s'envole, la suivante remonte.
 * Mobile, reduced motion ou écran trop bas : liste de cartes.
 */
export function HomeEventsDeck(props: DeckProps) {
  const count = props.events.length;
  if (count === 0) return null;

  return (
    <StickyTrack
      lengthVh={Math.round((count - 1 + HOLD) * TRACK_VH.deckPerCard + 100)}
      staticBelow="md"
      surface="dark"
      ariaLabelledby="home-events-title"
      className="bg-petrol"
    >
      <DeckStage {...props} />
    </StickyTrack>
  );
}

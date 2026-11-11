"use client";

import {
  animate,
  motion,
  motionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight } from "@/lib/icons";
import { easeInOutCubic, MOBILE_QUERY, TRACK_VH } from "@/lib/motion";
import { useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

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

type DeckProps = {
  eyebrow: string;
  title: string;
  titleSweep?: string;
  statusLabels: { upcoming: string; past: string };
  /** `native` : ancre de la même page (`#agenda`), défilée par Lenis. */
  cta: { href: string; label: string; native?: boolean };
  events: DeckEvent[];
  /** Accueil par défaut ; /evenements a son propre identifiant. */
  titleId?: string;
};

/** Pause de chaque carte avant qu'elle se décolle (Orbix : 18 %). */
const HOLD = 0.18;
/** Course supplémentaire de la carte qui s'envole (hauteur du titre au-dessus de la pile). */
const EXIT_VH = 40;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/* --- Contenu commun --------------------------------------------------------- */

function DeckHead({
  eyebrow,
  title,
  titleSweep,
  cta,
  titleId,
  aside,
}: Pick<DeckProps, "eyebrow" | "title" | "titleSweep" | "cta"> & { titleId: string; aside?: ReactNode }) {
  return (
    <div className="events-deck__head">
      <div>
        <p className="eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <SpectrumText
          as="h2"
          id={titleId}
          mode="scroll"
          text={title}
          sweep={titleSweep}
          className="title-section mt-4 text-h2 text-ivory text-balance"
        />
      </div>
      <div className="flex items-center gap-6">
        {aside}
        <Button href={cta.href} native={cta.native} variant="secondary" magnetic>
          {cta.label}
        </Button>
      </div>
    </div>
  );
}

function DeckCardContent({ event, statusLabel }: { event: DeckEvent; statusLabel: string }) {
  return (
    <>
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
    </>
  );
}

/* --- Desktop et tablette : pile pilotée par le scroll ----------------------- */

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
      <DeckCardContent event={event} statusLabel={statusLabel} />
    </motion.li>
  );
}

function DeckStage({ eyebrow, title, titleSweep, statusLabels, cta, events, titleId }: DeckProps & { titleId: string }) {
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
        <DeckHead
          eyebrow={eyebrow}
          title={title}
          titleSweep={titleSweep}
          cta={cta}
          titleId={titleId}
          aside={
            !isStatic &&
            count > 1 && (
              <p aria-hidden="true" className="events-deck__counter">
                <span className="text-gold">{String(active + 1).padStart(2, "0")}</span>
                <span className="text-ivory/40"> / {String(count).padStart(2, "0")}</span>
              </p>
            )
          }
        />

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

/* --- Mobile : pile qu'on balaie du doigt (phase 4 bis) ---------------------- */

const SWIPE_SPRING = { type: "spring", stiffness: 300, damping: 32, restDelta: 0.5 } as const;
/** Décision au lâcher : distance parcourue (px) ou vitesse (px/s). */
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 450;
/** Cartes visibles dans la pile (la carte du dessus et deux bords dessous). */
const SWIPE_VISIBLE = 3;
const SWIPE_STEP_PX = 14;

function SwipeCard({
  event,
  statusLabel,
  depth,
  count,
  leaving,
  x,
  onRelease,
}: {
  event: DeckEvent;
  statusLabel: string;
  depth: number;
  count: number;
  /** Carte en train de s'envoler : elle reste au premier plan jusqu'à sortir. */
  leaving: boolean;
  x: MotionValue<number>;
  onRelease: (info: PanInfo) => void;
}) {
  const rotate = useTransform(x, (v) => Math.max(-10, Math.min(10, v / 24)));
  const top = depth === 0 && !leaving;
  const d = leaving ? 0 : depth;
  const atBack = !leaving && count > 1 && depth === count - 1;

  // Carte partie : elle revient au fond de la pile, sans être vue si elle y est cachée.
  useEffect(() => {
    if (leaving || depth === 0 || x.get() === 0) return;
    if (depth >= SWIPE_VISIBLE) x.jump(0);
    else animate(x, 0, SWIPE_SPRING);
  }, [depth, leaving, x]);

  return (
    <motion.li
      inert={!top}
      className="deck-card deck-card--swipe shadow-long"
      style={{ x, rotate, zIndex: leaving ? count + 1 : count - depth }}
      initial={false}
      animate={{ y: d * SWIPE_STEP_PX, scale: 1 - d * 0.05, opacity: d < SWIPE_VISIBLE ? 1 : 0 }}
      // Opacité brève : la carte rappelée par « Précédent » arrive déjà opaque.
      transition={atBack ? { duration: 0 } : { default: SWIPE_SPRING, opacity: { duration: 0.12 } }}
      drag={top ? "x" : false}
      dragMomentum={false}
      onDragEnd={(_, info) => onRelease(info)}
    >
      <DeckCardContent event={event} statusLabel={statusLabel} />
    </motion.li>
  );
}

function DeckSwipe({ eyebrow, title, titleSweep, statusLabels, cta, events, titleId }: DeckProps & { titleId: string }) {
  const t = useTranslations("home");
  const count = events.length;
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const xs = useMemo(() => events.map(() => motionValue(0)), [events]);
  const pileRef = useRef<HTMLOListElement>(null);

  /** Assez loin pour que la carte inclinée sorte entièrement de l'écran. */
  const flyDistance = () => (pileRef.current?.offsetWidth ?? 400) * 1.35;

  const goNext = (direction: number, velocity = 0) => {
    if (count < 2) return;
    const index = active;
    setLeaving(index);
    setActive((index + 1) % count);
    animate(xs[index], direction * flyDistance(), { ...SWIPE_SPRING, velocity }).then(() => {
      setLeaving((current) => (current === index ? null : current));
    });
  };

  const goPrevious = () => {
    if (count < 2) return;
    const index = (active - 1 + count) % count;
    const x = xs[index];
    x.jump(-flyDistance());
    setLeaving(null);
    setActive(index);
    animate(x, 0, SWIPE_SPRING);
  };

  const release = (index: number, { offset, velocity }: PanInfo) => {
    const direction = Math.sign(offset.x);
    const flungBack = Math.abs(velocity.x) > SWIPE_VELOCITY && Math.sign(velocity.x) === -direction;
    const flung = Math.abs(velocity.x) > SWIPE_VELOCITY && Math.sign(velocity.x) === direction;
    if (direction !== 0 && ((Math.abs(offset.x) > SWIPE_DISTANCE && !flungBack) || flung)) {
      goNext(direction, velocity.x);
    } else {
      animate(xs[index], 0, SWIPE_SPRING);
    }
  };

  return (
    <section aria-labelledby={titleId} data-surface="dark" className="events-swipe bg-petrol">
      <DeckHead eyebrow={eyebrow} title={title} titleSweep={titleSweep} cta={cta} titleId={titleId} />

      <ol ref={pileRef} id={`${titleId}-pile`} className="events-swipe__pile">
        {events.map((event, index) => (
          <SwipeCard
            key={event.id}
            event={event}
            statusLabel={statusLabels[event.status]}
            depth={(index - active + count) % count}
            count={count}
            leaving={leaving === index}
            x={xs[index]}
            onRelease={(info) => release(index, info)}
          />
        ))}
      </ol>

      {count > 1 && (
        <>
          <div className="events-swipe__controls">
            <button
              type="button"
              className="events-swipe__button tap-press"
              aria-label={t("eventsPrev")}
              aria-controls={`${titleId}-pile`}
              onClick={goPrevious}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <p aria-hidden="true" className="events-deck__counter">
              <span className="text-gold">{String(active + 1).padStart(2, "0")}</span>
              <span className="text-ivory/40"> / {String(count).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              className="events-swipe__button tap-press"
              aria-label={t("eventsNext")}
              aria-controls={`${titleId}-pile`}
              onClick={() => goNext(-1)}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
          <p aria-hidden="true" className="events-swipe__hint">
            {t("eventsSwipeHint")}
          </p>
          <p aria-live="polite" className="sr-only">
            {t("eventsPosition", { current: active + 1, total: count })}
          </p>
        </>
      )}
    </section>
  );
}

/**
 * Agenda en pile qui se décolle (Orbix : études de cas, piste de
 * (n − 1) × 120 vh) : la carte du dessus s'envole, la suivante remonte.
 * Mobile (phase 4 bis) : la même pile se balaie du doigt, avec boutons
 * Précédent / Suivant pour le clavier et les lecteurs d'écran.
 * Reduced motion ou écran trop bas : liste de cartes.
 */
export function HomeEventsDeck({ titleId = "home-events-title", ...props }: DeckProps) {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const reduced = useReducedMotionSafe();
  const count = props.events.length;
  if (count === 0) return null;

  // Après hydratation seulement : le HTML serveur rend la piste, déjà
  // repliée en liste sous 768 px par la CSS.
  if (mobile && !reduced) return <DeckSwipe {...props} titleId={titleId} />;

  return (
    <StickyTrack
      lengthVh={Math.round((count - 1 + HOLD) * TRACK_VH.deckPerCard + 100)}
      staticBelow="md"
      surface="dark"
      ariaLabelledby={titleId}
      className="bg-petrol"
    >
      <DeckStage {...props} titleId={titleId} />
    </StickyTrack>
  );
}

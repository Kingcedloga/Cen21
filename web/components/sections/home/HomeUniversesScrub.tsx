"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { keyframes, TRACK_VH } from "@/lib/motion";

import "@/styles/home-universes.css";

export type UniverseCard = {
  key: string;
  /** Petite ligne au-dessus du titre (ex. « Chapitre 01 » sur À propos). */
  eyebrow?: string;
  title: string;
  text: string;
  image: string;
  /** Adresses de cet univers (pastilles), avec leur libellé de liste. */
  venues?: { label: string; names: string[] };
};

/**
 * Keyframes d'Orbix (IX2 « Approach Horizontal Scrub », piste de 500 vh).
 * La piste part de 100vw et recule d'une carte à chaque palier ; la première
 * carte entre en pivotant depuis le coin bas droit ; le titre de fond s'efface.
 */
const TRACK_STOPS = [0.25, 0.45, 0.64, 0.73] as const;
const FIRST_IN = [0.15, 0.25] as const;
const UNDERLAY_OUT = [0.3, 0.45] as const;

function trackStops(count: number): { stops: number[]; values: number[] } {
  if (count === TRACK_STOPS.length) return { stops: [...TRACK_STOPS], values: [1, 2, 3, 4] };
  const stops = Array.from({ length: count }, (_, i) =>
    count === 1 ? TRACK_STOPS[0] : TRACK_STOPS[0] + ((TRACK_STOPS[3] - TRACK_STOPS[0]) * i) / (count - 1),
  );
  return { stops, values: stops.map((_, i) => i + 1) };
}

function UniverseItem({
  card,
  index,
  progress,
  isStatic,
}: {
  card: UniverseCard;
  index: number;
  progress: MotionValue<number>;
  isStatic: boolean;
}) {
  const x = useTransform(progress, (v) => `${keyframes(v, FIRST_IN, [45, 0])}vw`);
  const y = useTransform(progress, (v) => `${keyframes(v, FIRST_IN, [70, 0])}vh`);
  const scale = useTransform(progress, (v) => keyframes(v, FIRST_IN, [0.62, 1]));
  const rotate = useTransform(progress, (v) => keyframes(v, FIRST_IN, [6, 0]));
  const entering = index === 0 && !isStatic;
  const tone = index % 2 === 0 ? "light" : "dark";

  return (
    <motion.li
      data-track-motion={index === 0 ? "" : undefined}
      className={`universe-card universe-card--${tone} ${index % 2 === 1 ? "universe-card--media-first" : ""}`}
      style={entering ? { x, y, scale, rotate } : undefined}
    >
      <div className="universe-card__text">
        {card.eyebrow && <p className="universe-card__eyebrow">{card.eyebrow}</p>}
        <h3 className="title-section text-h3">{card.title}</h3>
        <p className="universe-card__body">{card.text}</p>
        {card.venues && card.venues.names.length > 0 && (
          <ul aria-label={card.venues.label} className="universe-card__venues">
            {card.venues.names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="universe-card__media">
        <Image src={card.image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 40vw" className="object-cover" />
      </div>
    </motion.li>
  );
}

function UniversesStage({
  badge,
  title,
  titleSweep,
  titleId,
  cards,
}: {
  badge: string;
  title: string;
  titleSweep?: string;
  titleId: string;
  cards: UniverseCard[];
}) {
  const { progress, isStatic } = useStickyTrack();
  const { stops, values } = trackStops(cards.length);
  // Mobile : --track-shift centre la carte active (bords des voisines visibles).
  const trackX = useTransform(
    progress,
    (v) => `calc(var(--card-w) * ${-keyframes(v, stops, values)} - var(--track-shift))`,
  );
  const underlay = useTransform(progress, (v) => keyframes(v, UNDERLAY_OUT, [1, 0]));

  return (
    <div className="universes" data-static={isStatic ? "" : undefined}>
      {/* Cadre de découpe : les cartes hors champ ne débordent pas de la scène
          (la piste ne se désépingle pas sur leur débord). */}
      <div className="universes__frame">
        <motion.div
          data-track-motion=""
          className="universes__underlay"
          style={isStatic ? undefined : { opacity: underlay, scale: underlay }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="universes__badge">{badge}</p>
            <SpectrumText
              as="h2"
              id={titleId}
              mode="scroll"
              text={title}
              sweep={titleSweep}
              className="title-section mt-6 text-h2 text-ivory text-balance"
            />
          </div>
        </motion.div>

        <motion.ul
          data-track-motion=""
          className="universes__track"
          style={isStatic ? undefined : { x: trackX }}
        >
          {cards.map((card, index) => (
            <UniverseItem key={card.key} card={card} index={index} progress={progress} isStatic={isStatic} />
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

/**
 * « Nos univers » : quatre cartes alternées sable et pétrole qui défilent à
 * l'horizontale pendant que la page descend (Orbix : section « approach »).
 * Mobile (phase 4 bis) : même chorégraphie, cartes centrées à 88vw et piste
 * plus courte. Reduced motion ou écran trop bas : titre puis cartes empilées.
 */
export function HomeUniversesScrub({
  titleId = "home-universes-title",
  ...props
}: {
  badge: string;
  title: string;
  titleSweep?: string;
  /** Plusieurs pistes sur le site : accueil (« Nos univers ») et À propos (frise). */
  titleId?: string;
  cards: UniverseCard[];
}) {
  return (
    <>
      <StickyTrack
        lengthVh={TRACK_VH.universes}
        mobileLengthVh={TRACK_VH.universesMobile}
        surface="dark"
        ariaLabelledby={titleId}
        className="bg-petrol-panel-4"
      >
        <UniversesStage {...props} titleId={titleId} />
      </StickyTrack>
      {/* Marge de fond : les cartes occupent toute la hauteur de la scène, le
          séparateur fondu qui suit se pose ici plutôt que sur leur bas. */}
      <div aria-hidden="true" data-surface="dark" className="universes-tail" />
    </>
  );
}

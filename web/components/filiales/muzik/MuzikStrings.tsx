"use client";

import { animate, motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { disableGuitar, enableGuitar, pluck } from "@/lib/guitar-sound";
import { Volume2, VolumeX } from "@/lib/icons";

import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/muzik.css";

/** Hauteur de la bande (unités du viewBox = pixels : la largeur seule s'étire). */
const BAND = 120;
/** Six cordes, de la plus aiguë (fine) à la plus grave (épaisse). */
const STRINGS = [0, 1, 2, 3, 4, 5] as const;
const GAP = 12;
const FIRST = (BAND - GAP * (STRINGS.length - 1)) / 2;
const WIDTHS = [1, 1.25, 1.5, 1.9, 2.4, 3];
/** Amplitude de la vibration de défilement, par corde (les graves bougent plus). */
const SWING = [5, 6, 7, 8, 9.5, 11];
/** Sens alterné : les cordes ne vibrent pas toutes ensemble. */
const PHASE = [1, -0.8, 0.9, -1, 0.85, -0.95];

type Pluckable = { bend: MotionValue<number>; at: MotionValue<number> };

/** Délai minimal entre deux notes d'une même corde (ms) : pas de crépitement. */
const RETRIGGER_MS = 70;
/** Déplacement vertical (px par mouvement) qui donne une note à plein volume. */
const FULL_STRENGTH_PX = 28;

/**
 * Les six cordes de la guitare du logo, tendues sur toute la largeur.
 * Défilement : la vitesse de la page tend les cordes ; quand le défilement
 * s'arrête, un ressort peu amorti les fait vibrer puis se poser (rien ne
 * bouge seul). À la souris, passer sur une corde la pince : elle vibre au
 * point touché et, son activé, joue sa note (mi4 → mi2, lib/guitar-sound.ts),
 * plus fort si le geste est rapide, à gauche ou à droite selon l'endroit.
 * Le son ne démarre qu'au clic sur « Son des cordes » (les navigateurs
 * interdisent l'audio au survol) et reste coupé par défaut.
 * Reduced motion : cordes droites, immobiles, sans son.
 */
export function MuzikStrings({ className = "" }: { className?: string }) {
  const t = useTranslations("muzik");
  const reduced = useReducedMotionSafe();
  const [sound, setSound] = useState(false);
  const lastPluck = useRef<number[]>(STRINGS.map(() => 0));
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const svgRef = useRef<SVGSVGElement>(null);
  const strings = useRef<(Pluckable | null)[]>([]);
  const lastY = useRef<number | null>(null);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const push = useTransform(velocity, (v) => Math.max(-1, Math.min(1, v / 2600)));
  const swing = useSpring(push, { stiffness: 320, damping: 6, mass: 0.6 });

  // Pincer : la corde franchie par le pointeur part dans le sens du geste.
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || reduced) return;
    const rect = svg.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    const previous = lastY.current;
    lastY.current = y;
    if (previous === null) return;
    STRINGS.forEach((index) => {
      const line = FIRST + index * GAP;
      const crossed = (previous - line) * (y - line) <= 0 && previous !== y;
      const target = strings.current[index];
      if (!crossed || !target) return;
      target.at.set(Math.max(80, Math.min(920, x)));
      const now = performance.now();
      if (sound && now - lastPluck.current[index] > RETRIGGER_MS) {
        lastPluck.current[index] = now;
        pluck(index, Math.abs(y - previous) / FULL_STRENGTH_PX, x / 500 - 1);
      }
      animate(target.bend, 0, { type: "spring", velocity: Math.sign(y - previous) * 520, stiffness: 520, damping: 7 });
    });
  };

  const toggleSound = async () => {
    if (sound) {
      disableGuitar();
      setSound(false);
      return;
    }
    setSound(await enableGuitar());
  };

  const playable = finePointer && !reduced;

  return (
    <div className="muzik-strings-wrap">
      {playable && (
        <div className="muzik-strings__sound">
          <button
            type="button"
            className="muzik-strings__toggle tap-press"
            aria-pressed={sound}
            aria-label={sound ? t("stringsSoundOff") : t("stringsSoundOn")}
            onClick={toggleSound}
          >
            {sound ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
            <span aria-hidden="true">{t("stringsSound")}</span>
          </button>
        </div>
      )}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className={`muzik-strings ${className}`}
        viewBox={`0 0 1000 ${BAND}`}
        preserveAspectRatio="none"
        onPointerMove={playable ? onPointerMove : undefined}
        onPointerLeave={() => {
          lastY.current = null;
        }}
      >
        {STRINGS.map((index) => (
          <GuitarString
            key={index}
            index={index}
            swing={swing}
            still={reduced}
            register={(value) => {
              strings.current[index] = value;
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function GuitarString({
  index,
  swing,
  still,
  register,
}: {
  index: number;
  swing: MotionValue<number>;
  still: boolean;
  register: (value: Pluckable) => void;
}) {
  const y = FIRST + index * GAP;
  const bend = useMotionValue(0);
  const at = useMotionValue(500);
  useEffect(() => register({ bend, at }), [register, bend, at]);
  // Courbe quadratique : le point de contrôle à 2 × le déplacement voulu.
  const d = useTransform(() => {
    const offset = bend.get() + swing.get() * SWING[index] * PHASE[index];
    return `M 0 ${y} Q ${at.get().toFixed(1)} ${(y + 2 * offset).toFixed(2)} 1000 ${y}`;
  });

  return (
    <motion.path
      d={still ? `M 0 ${y} L 1000 ${y}` : d}
      strokeWidth={WIDTHS[index]}
      vectorEffect="non-scaling-stroke"
      className="muzik-strings__string"
    />
  );
}

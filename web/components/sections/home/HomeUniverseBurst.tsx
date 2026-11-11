"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, type RefObject } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { keyframes, TRACK_VH } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import type { SocialLinks as SocialLinksType } from "@/lib/types";

import "@/styles/home-burst.css";

/**
 * Repères sur la timeline d'Orbix (0 → 1). Chez Orbix, la scène ne bouge
 * qu'entre 0,25 et 0,75 de la piste, et les photos ont quitté l'écran vers
 * 0,57 : le reste est du scroll « mort », d'où une explosion très rapide.
 * Ici chaque scène joue la timeline de son `start` (ou de `BURST_REST` au
 * survol) à son `exit` sur toute la piste, moins un palier final.
 */
/** Photos posées autour du message : là où le survol amène la scène. */
const BURST_REST = 0.45;
/** Fin de piste où le message reste seul, l'envol terminé, avant de se désépingler. */
const SCROLL_HOLD = 0.15;

/** Keyframes du groupe (IX2 « a-300 ») : apparition au centre, gonflement, envol.
 *  L'opacité dépend de la scène : fondu de sortie à son `exit` (Orbix : 0,7 → 0,75). */
const GROUP_SCALE = { stops: [0.25, 0.5, 0.75], values: [0.1, 1.2, 2] } as const;
const MOVE_FROM = 0.38;
const SCALE_FROM = 0.32;

/** Une photo de la scène. */
type SceneCard = {
  /** Position dans la scène (CSS). */
  place: { top?: string; bottom?: string; left?: string; right?: string };
  /** Largeur (CSS) et ratio. */
  width: string;
  ratio: string;
  /** Projection [x, y] atteinte à `moveEnd`, dans les unités de la scène. */
  move: readonly [number, number];
  moveEnd: number;
  /** Parallaxe au curseur : 1 au premier plan, bouge le plus. */
  depth: number;
  /** Agrandissement final. */
  scale?: number;
  /** Au-dessus des autres photos. */
  front?: boolean;
  /** Masquée sous 1 024 px. */
  wideOnly?: boolean;
};

type Scene = {
  /** Clé de la scène : changer de scène remonte les photos. */
  id: string;
  /** Départ de la timeline au scroll, sans survol. */
  start: number;
  /** Dernières photos hors de l'écran : fin de la timeline et du fondu. */
  exit: number;
  cards: readonly SceneCard[];
  /** Projections et parallaxe (unités de la scène) → CSS. */
  x: (value: number) => string;
  y: (value: number) => string;
  /** Parallaxe maximale d'une photo au premier plan, dans ces unités. */
  parallax: number;
  /** Classe d'ombre des photos. */
  shadow: string;
  sizes: string;
};

/** Les projections d'Orbix sont en px pour 1 440 px de large : converties en vw. */
const vw = (px: number) => `${(px / 14.4).toFixed(3)}vw`;

/** Largeur d'Orbix à 1 440 px, proportionnelle au viewport, bornée pour la
 *  tablette et les très grands écrans. */
const cardWidth = (px: number) => `clamp(${Math.round(px * 0.62)}px, ${vw(px)}, ${Math.round(px * 1.3)}px)`;

/** Parallaxe : déplacement maximal d'une photo au premier plan (px à 1 440 px). */
const PARALLAX_PX = 36;

/**
 * Tablette et desktop : les dix photos d'Orbix (« wave-image-1 » à « -10 »)
 * autour du message. Largeurs et projections en px à 1 440 px de large.
 */
const WIDE_SCENE: Scene = {
  id: "wide",
  /** Apparition au centre, comme Orbix. Sortie mesurée de 1 024 à 1 920 px. */
  start: 0.25,
  exit: 0.58,
  cards: [
    { place: { top: "6%", left: "20%" }, width: cardWidth(240), ratio: "4 / 3", move: [-700, -300], moveEnd: 0.57, depth: 0.6 },
    { place: { top: "15%", left: "5%" }, width: cardWidth(270), ratio: "5 / 4", move: [-300, -500], moveEnd: 0.7, depth: 0.5, wideOnly: true },
    { place: { bottom: "45%", left: "8%" }, width: cardWidth(244), ratio: "1 / 1", move: [-400, 0], moveEnd: 0.7, depth: 0.55 },
    { place: { bottom: "23%", left: "22%" }, width: cardWidth(220), ratio: "4 / 5", move: [-700, 100], moveEnd: 0.57, depth: 1, scale: 2, front: true },
    { place: { bottom: "11%", left: "12%" }, width: cardWidth(290), ratio: "4 / 3", move: [-500, 200], moveEnd: 0.7, depth: 0.7 },
    { place: { top: "15%", right: "18%" }, width: cardWidth(280), ratio: "5 / 4", move: [500, -600], moveEnd: 0.7, depth: 0.85, scale: 1.5 },
    { place: { top: "5%", right: "5%" }, width: cardWidth(220), ratio: "1 / 1", move: [700, -200], moveEnd: 0.57, depth: 0.45 },
    { place: { bottom: "42%", right: "10%" }, width: cardWidth(290), ratio: "4 / 3", move: [400, -400], moveEnd: 0.7, depth: 1, scale: 1.3, front: true },
    { place: { bottom: "32%", right: "1%" }, width: cardWidth(260), ratio: "4 / 5", move: [200, 200], moveEnd: 0.7, depth: 0.6 },
    { place: { bottom: "16%", right: "16%" }, width: cardWidth(240), ratio: "4 / 3", move: [500, 300], moveEnd: 0.7, depth: 0.5 },
  ],
  x: vw,
  y: vw,
  parallax: PARALLAX_PX,
  shadow: "shadow-long",
  sizes: "(max-width: 1440px) 20vw, 300px",
};

/**
 * Mobile (portrait) : le message prend toute la largeur. Six photos se posent
 * dans les bandes libres au-dessus et au-dessous, sortent de derrière le
 * message (voile : home-burst.css) et s'envolent vers le haut et le bas.
 * Projections en vw (x) et en vh (y). Sans ombre : teintée comme le fond,
 * elle ne se voit pas et coûte cher à peindre.
 */
const COMPACT_SCENE: Scene = {
  id: "compact",
  /** Le scroll part quand les photos vont sortir de derrière le message, et
   *  s'arrête quand elles ont quitté l'écran (mesuré de 360 à 430 px). */
  start: 0.36,
  exit: 0.525,
  cards: [
    { place: { top: "3%", left: "4%" }, width: "34vw", ratio: "4 / 5", move: [-14, -22], moveEnd: 0.57, depth: 0.8 },
    { place: { top: "12%", left: "36%" }, width: "27vw", ratio: "4 / 3", move: [0, -30], moveEnd: 0.6, depth: 0.5 },
    { place: { top: "6%", right: "5%" }, width: "30vw", ratio: "1 / 1", move: [14, -26], moveEnd: 0.57, depth: 0.65, front: true },
    { place: { bottom: "11%", left: "5%" }, width: "32vw", ratio: "1 / 1", move: [-14, 24], moveEnd: 0.57, depth: 0.7 },
    { place: { bottom: "4%", left: "38%" }, width: "26vw", ratio: "4 / 3", move: [0, 30], moveEnd: 0.6, depth: 0.5, front: true },
    { place: { bottom: "7%", right: "4%" }, width: "34vw", ratio: "4 / 5", move: [14, 22], moveEnd: 0.57, depth: 0.85 },
  ],
  x: (value) => `${value.toFixed(3)}vw`,
  y: (value) => `${value.toFixed(3)}vh`,
  parallax: 2.5,
  shadow: "",
  sizes: "40vw",
};

const COMPACT_QUERY = "(max-width: 767.98px)";

/** Survol : jaillissement des photos (léger rebond), puis suivi du curseur. */
const HOVER_SPRING = { stiffness: 60, damping: 14, mass: 1 };
const POINTER_SPRING = { stiffness: 120, damping: 24, mass: 1 };
/** Inclinaison maximale de la scène (degrés) et perspective (px). */
const TILT_DEG = 5;
const PERSPECTIVE_PX = 1200;

/**
 * Position sur la timeline d'Orbix. Le survol avance le départ jusqu'à la
 * pose (`BURST_REST`) ; le scroll mène de ce départ à l'envol.
 */
function burstTimeline(scroll: number, hover: number, scene: Scene): number {
  const rest = Math.max(BURST_REST, scene.start);
  const from = scene.start + (rest - scene.start) * hover;
  const travel = Math.min(1, Math.max(0, scroll) / (1 - SCROLL_HOLD));
  return from + (scene.exit - from) * travel;
}

type BurstPointer = {
  /** 0 → 1 : curseur hors de la scène → dans la scène (amorti). */
  hover: MotionValue<number>;
  /** Position du curseur dans la scène, de −1 (gauche, haut) à 1 (droite, bas). */
  x: MotionValue<number>;
  y: MotionValue<number>;
};

/**
 * Curseur dans la scène. Le test est refait au scroll : la scène peut venir
 * sous un curseur immobile. Souris seulement (le doigt n'a pas de survol).
 */
function useBurstPointer(ref: RefObject<HTMLElement | null>, enabled: boolean): BurstPointer {
  const hoverTarget = useMotionValue(0);
  const xTarget = useMotionValue(0);
  const yTarget = useMotionValue(0);
  const hover = useSpring(hoverTarget, HOVER_SPRING);
  const x = useSpring(xTarget, POINTER_SPRING);
  const y = useSpring(yTarget, POINTER_SPRING);

  useEffect(() => {
    if (!enabled) {
      hoverTarget.set(0);
      return;
    }
    let pointer: { x: number; y: number } | null = null;

    const update = () => {
      const element = ref.current;
      if (!element || !pointer) {
        hoverTarget.set(0);
        return;
      }
      // Partie visible de la scène seulement.
      const rect = element.getBoundingClientRect();
      const top = Math.max(rect.top, 0);
      const bottom = Math.min(rect.bottom, window.innerHeight);
      const inside =
        bottom > top &&
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= top &&
        pointer.y <= bottom;
      hoverTarget.set(inside ? 1 : 0);
      if (inside) {
        xTarget.set(((pointer.x - rect.left) / rect.width) * 2 - 1);
        yTarget.set(((pointer.y - top) / (bottom - top)) * 2 - 1);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      update();
    };
    const onLeave = () => {
      pointer = null;
      update();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", update);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, ref, hoverTarget, xTarget, yTarget]);

  return { hover, x, y };
}

export type BurstImage = { src: string };

type BurstProps = {
  eyebrow: string;
  title: string;
  titleSweep?: string;
  text: string;
  cta: { href: string; label: string };
  socialLabel: string;
  social: SocialLinksType;
  images: BurstImage[];
};

function BurstCard({
  card,
  scene,
  src,
  timeline,
  pointer,
}: {
  card: SceneCard;
  scene: Scene;
  src: string;
  timeline: MotionValue<number>;
  pointer: BurstPointer;
}) {
  const scaleTo = card.scale ?? 1;
  const reach = scene.parallax * card.depth;
  // Projection d'Orbix + parallaxe : la photo s'écarte du curseur, d'autant
  // plus qu'elle est proche, et seulement pendant le survol.
  const x = useTransform([timeline, pointer.x, pointer.hover], ([t, px, h]: number[]) =>
    scene.x(keyframes(t, [MOVE_FROM, card.moveEnd], [0, card.move[0]]) - px * reach * h),
  );
  const y = useTransform([timeline, pointer.y, pointer.hover], ([t, py, h]: number[]) =>
    scene.y(keyframes(t, [MOVE_FROM, card.moveEnd], [0, card.move[1]]) - py * reach * h),
  );
  const scale = useTransform(timeline, (t) => keyframes(t, [SCALE_FROM, 0.7], [1, scaleTo]));
  const classes = [
    "burst-card",
    scene.shadow,
    card.wideOnly ? "burst-card--wide-only" : "",
    card.front ? "z-[1]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={classes}
      style={{ ...card.place, width: card.width, aspectRatio: card.ratio, x, y, scale }}
    >
      <Image src={src} alt="" fill sizes={scene.sizes} className="object-cover" />
    </motion.div>
  );
}

function BurstCanvas({
  scene,
  images,
  progress,
  pointer,
}: {
  scene: Scene;
  images: BurstImage[];
  progress: MotionValue<number>;
  pointer: BurstPointer;
}) {
  const timeline = useTransform([progress, pointer.hover], ([scroll, hover]: number[]) =>
    burstTimeline(scroll, hover, scene),
  );
  const scale = useTransform(timeline, (t) => keyframes(t, GROUP_SCALE.stops, GROUP_SCALE.values));
  const opacity = useTransform(timeline, (t) => keyframes(t, [0.25, 0.32, scene.exit - 0.04, scene.exit], [0, 1, 1, 0]));
  // Inclinaison 3D : le côté sous le curseur s'enfonce.
  const rotateY = useTransform([pointer.x, pointer.hover], ([px, h]: number[]) => px * TILT_DEG * h);
  const rotateX = useTransform([pointer.y, pointer.hover], ([py, h]: number[]) => -py * TILT_DEG * h);

  return (
    <div aria-hidden="true" className="burst-canvas">
      <motion.div
        className="absolute inset-0"
        style={{ scale, opacity, rotateX, rotateY, transformPerspective: PERSPECTIVE_PX }}
      >
        {images.slice(0, scene.cards.length).map((image, index) => (
          <BurstCard
            key={`${scene.id}-${image.src}-${index}`}
            card={scene.cards[index]}
            scene={scene}
            src={image.src}
            timeline={timeline}
            pointer={pointer}
          />
        ))}
      </motion.div>
    </div>
  );
}

function BurstStage({
  eyebrow,
  title,
  titleSweep,
  text,
  cta,
  socialLabel,
  social,
  images,
}: BurstProps) {
  const { progress, isStatic } = useStickyTrack();
  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useBurstPointer(stageRef, !isStatic);
  // Rendu serveur : scène large. Sur mobile, la scène compacte la remplace à
  // l'hydratation, invisible à ce moment (groupe à opacité 0 en début de piste).
  const scene = useMediaQuery(COMPACT_QUERY) ? COMPACT_SCENE : WIDE_SCENE;

  return (
    <div
      ref={stageRef}
      className={`relative flex min-h-full items-center justify-center px-4 md:px-8 ${isStatic ? "py-24 md:py-28" : ""}`}
    >
      {!isStatic && (
        <BurstCanvas key={scene.id} scene={scene} images={images} progress={progress} pointer={pointer} />
      )}

      <div className="burst-shuttle">
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <p className="eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-rose">{eyebrow}</p>
          <SpectrumText
            as="h2"
            id="home-burst-title"
            mode="scroll"
            text={title}
            sweep={titleSweep}
            className="title-section max-w-[15ch] text-h2 text-ivory text-balance"
          />
          <p className="max-w-xl text-base leading-relaxed text-ivory/75 md:text-lg">{text}</p>
          <Button href={cta.href} magnetic>
            {cta.label}
          </Button>
        </div>
        <SocialLinks social={social} label={socialLabel} className="burst-social mt-12 flex flex-col items-center md:mt-16" />
      </div>
    </div>
  );
}

/**
 * « Un groupe, dix univers » (Orbix : section « hero_track »).
 * Au survol, les photos des filiales jaillissent du centre, se posent autour
 * du message et suivent le curseur en profondeur. Le scroll les écarte puis
 * les fait s'envoler. Mobile : six photos au-dessus et au-dessous du message,
 * menées par le scroll seul, sur une piste plus courte. Reduced motion : le
 * message seul.
 */
export function HomeUniverseBurst(props: BurstProps) {
  return (
    <StickyTrack
      lengthVh={TRACK_VH.burst}
      mobileLengthVh={TRACK_VH.burstMobile}
      surface="dark"
      ariaLabelledby="home-burst-title"
      className="bg-petrol-panel-4"
    >
      <BurstStage {...props} />
    </StickyTrack>
  );
}

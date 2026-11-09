"use client";

import { useScroll, type MotionValue } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/motion-primitives.css";

type StaticBelow = "md" | "lg";

type StickyTrackContextValue = {
  /** Progression 0 → 1 entre l'arrivée de la piste en haut de l'écran et sa sortie. */
  progress: MotionValue<number>;
  /** `true` en reduced motion ou sous le palier `staticBelow` : ne rien animer. */
  isStatic: boolean;
};

const StickyTrackContext = createContext<StickyTrackContextValue | null>(null);

/** Progression et état statique de la piste englobante. */
export function useStickyTrack(): StickyTrackContextValue {
  const value = useContext(StickyTrackContext);
  if (!value) throw new Error("useStickyTrack() doit être appelé dans <StickyTrack>.");
  return value;
}

const BELOW_QUERY: Record<StaticBelow, string> = {
  md: "(max-width: 767.98px)",
  lg: "(max-width: 1023.98px)",
};

/**
 * Piste de défilement : une section haute de `lengthVh` vh dont la scène reste
 * collée en haut de l'écran pendant `lengthVh − 100` vh de scroll.
 *
 * Les enfants lisent la progression avec `useStickyTrack()` et la transforment
 * avec `useTransform` (keyframes Orbix recopiées telles quelles). Chaque élément
 * animé porte `data-track-motion` : en reduced motion (et sous `staticBelow`),
 * la CSS annule ses transformations dès le HTML serveur, et la piste se replie
 * en section ordinaire, sans hauteur artificielle ni épinglage.
 */
export function StickyTrack({
  lengthVh,
  mobileLengthVh,
  staticBelow,
  surface,
  id,
  ariaLabelledby,
  className = "",
  stageClassName = "",
  children,
}: {
  lengthVh: number;
  /** Longueur sous 768 px, pour une piste qui reste épinglée sur mobile (sans `staticBelow`). */
  mobileLengthVh?: number;
  staticBelow?: StaticBelow;
  surface?: "dark" | "light";
  id?: string;
  ariaLabelledby?: string;
  className?: string;
  stageClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const reduced = useReducedMotionSafe();
  const below = useMediaQuery(staticBelow ? BELOW_QUERY[staticBelow] : "not all");
  const [overflowing, setOverflowing] = useState(false);
  const forcedStatic = reduced || (staticBelow !== undefined && below);
  const isOverflowing = overflowing && !forcedStatic;
  const isStatic = forcedStatic || isOverflowing;

  // Filet de sécurité : si le contenu de la scène dépasse la hauteur d'écran
  // (écran bas, texte long), la piste se désépingle plutôt que de rogner.
  // Mesure seulement quand la piste peut s'épingler : en rendu statique imposé
  // (mobile, reduced motion), le contenu empilé est plus haut que l'écran et
  // l'état resterait figé au retour sur grand écran.
  useEffect(() => {
    if (forcedStatic) return;
    const content = stageRef.current?.firstElementChild;
    if (!(content instanceof HTMLElement)) return;
    const check = () => setOverflowing(content.scrollHeight > window.innerHeight + 1);
    const observer = new ResizeObserver(check);
    observer.observe(content);
    window.addEventListener("resize", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [forcedStatic]);

  const value = useMemo(
    () => ({ progress: scrollYProgress, isStatic }),
    [scrollYProgress, isStatic],
  );

  const classes = [
    "sticky-track",
    staticBelow ? `sticky-track--static-below-${staticBelow}` : "",
    isOverflowing ? "sticky-track--overflow" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledby}
      data-surface={surface}
      className={classes}
      style={
        {
          "--track-vh": lengthVh,
          ...(mobileLengthVh !== undefined && { "--track-vh-sm": mobileLengthVh }),
        } as CSSProperties
      }
    >
      <div ref={stageRef} className={`sticky-track__stage ${stageClassName}`}>
        <StickyTrackContext.Provider value={value}>{children}</StickyTrackContext.Provider>
      </div>
    </section>
  );
}

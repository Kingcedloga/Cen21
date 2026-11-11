"use client";

import {
  animate,
  useIsomorphicLayoutEffect,
  useMotionValueEvent,
  useScroll,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode, type RefObject } from "react";

import { playSweep, sweepClassName, type SweepTone } from "@/components/motion/GradientSweep";
import { SPECTRUM_ROSE } from "@/lib/motion";
import { introMissed, onSiteReady } from "@/lib/site-ready";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/motion-primitives.css";

type TextTag = "h1" | "h2" | "h3" | "h4" | "p";
type RGB = readonly [number, number, number];

/** Durée de la révélation au chargement (Orbix : 1 250 ms). */
const LOAD_DURATION_S = 1.25;
/** Plage de scroll : de « haut du texte à 92 % de l'écran » à « haut du texte à 42 % ». */
const SCROLL_OFFSET: ["start 0.92", "start 0.42"] = ["start 0.92", "start 0.42"];
/** Lettre fantôme de départ : sable (première couleur du spectre). */
const GHOST: RGB = SPECTRUM_ROSE[0];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Progression atteinte quand la page est défilée jusqu'en bas. Inférieure à 1
 * pour un texte trop proche du bas de page (bande de clôture, dernière
 * section) : la révélation est alors étirée pour finir au bas de la page.
 */
function reachableProgress(root: HTMLElement): number {
  const viewport = window.innerHeight;
  const maxScroll = document.documentElement.scrollHeight - viewport;
  const topAtBottom = root.getBoundingClientRect().top + window.scrollY - maxScroll;
  return clamp01((viewport * 0.92 - topAtBottom) / (viewport * 0.5));
}

function mix(from: RGB, to: RGB, k: number): RGB {
  return [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k, from[2] + (to[2] - from[2]) * k];
}

function spectrumAt(position: number): RGB {
  const scaled = clamp01(position) * (SPECTRUM_ROSE.length - 1);
  const index = Math.min(SPECTRUM_ROSE.length - 2, Math.floor(scaled));
  return mix(SPECTRUM_ROSE[index], SPECTRUM_ROSE[index + 1], scaled - index);
}

/** `rgb(…)`, `rgba(…)`, `#rgb` ou `#rrggbb` → RGB. */
function parseColor(color: string): RGB | null {
  const value = color.trim();
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const digits = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    return [0, 2, 4].map((offset) => parseInt(digits.slice(offset, offset + 2), 16)) as unknown as RGB;
  }
  const channels = value.match(/^rgba?\(([^)]+)\)$/i)?.[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return channels && channels.length >= 3 ? [channels[0], channels[1], channels[2]] : null;
}

function rgb([r, g, b]: RGB) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/** Découpe déterministe (identique serveur et client) : mots insécables, lettres en ligne. */
function renderWords(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/(\s+)/)
    .filter(Boolean)
    .map((token, index) =>
      /^\s+$/.test(token) ? (
        " "
      ) : (
        <span key={`${keyPrefix}-${index}`} className="spectrum-word">
          {Array.from(token.normalize("NFC")).map((character, charIndex) => (
            <span key={charIndex} className="spectrum-char" data-ch="">
              {character}
            </span>
          ))}
        </span>
      ),
    );
}

function splitOnSweep(text: string, sweep?: string) {
  const start = sweep ? text.indexOf(sweep) : -1;
  if (!sweep || start < 0) return [{ text, sweep: false }];
  return [
    { text: text.slice(0, start), sweep: false },
    { text: sweep, sweep: true },
    { text: text.slice(start + sweep.length), sweep: false },
  ].filter((segment) => segment.text.length > 0);
}

/**
 * Texte révélé lettre par lettre (signature d'Orbix, palette Cen21) :
 * chaque lettre passe du flou (8 px) à une couleur du spectre or, puis à sa
 * couleur finale, avec une fenêtre glissante de gauche à droite.
 *
 * Pilotage :
 * - `mode="load"` : joue une fois (1,25 s) quand le loader du site s'efface,
 *   après `delay` secondes. Pour le titre du hero.
 * - `mode="scroll"` : suit la position du texte dans l'écran, dans les deux sens.
 * - `progress` : progression externe 0 → 1 (piste épinglée) ; prioritaire.
 *
 * Mot d'accent (`sweep`) : balayé en or à la fin de la révélation.
 * `sweepWhole` le révèle d'un bloc (écriture cursive dont les lettres se lient),
 * `sweepClassName` lui ajoute ses propres classes.
 *
 * Accessibilité : titres → `aria-label` ; paragraphe → copie `sr-only` (un
 * aria-label sur <p> n'est pas annoncé). Les lettres sont `aria-hidden`.
 * Le HTML serveur affiche le texte fini ; en reduced motion, rien n'est animé.
 */
export function SpectrumText({
  text,
  as: Tag = "h2",
  mode = "scroll",
  progress,
  sweep,
  tone = "dark",
  sweepClassName: sweepExtraClassName = "",
  sweepWhole = false,
  delay = 0,
  id,
  className = "",
}: {
  text: string;
  as?: TextTag;
  mode?: "load" | "scroll";
  progress?: MotionValue<number>;
  sweep?: string;
  tone?: SweepTone;
  sweepClassName?: string;
  sweepWhole?: boolean;
  delay?: number;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const paintRef = useRef<((value: number) => void) | null>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: SCROLL_OFFSET });
  const driver = progress ? "external" : mode;

  useMotionValueEvent(progress ?? scrollYProgress, "change", (value) => {
    if (driver !== "load") paintRef.current?.(value);
  });

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;

    const units = Array.from(root.querySelectorAll<HTMLElement>("[data-ch]"));
    const count = units.length;
    if (!count) return;

    const sweepHost = root.querySelector<HTMLElement>("[data-sweep]");
    const inSweep = units.map((unit) => (sweepHost ? sweepHost.contains(unit) : false));
    const accents = units.map((_, index) => spectrumAt(index / Math.max(1, count - 1)));
    const rootColor = parseColor(getComputedStyle(root).color) ?? GHOST;
    const sweepRest = sweepHost
      ? (parseColor(getComputedStyle(sweepHost).getPropertyValue("--sweep-rest")) ?? rootColor)
      : rootColor;
    const last = new Float32Array(count).fill(-1);
    let sweepRevealing = false;

    const paint = (value: number) => {
      let sweepIncomplete = false;
      for (let index = 0; index < count; index += 1) {
        const t = clamp01((value * 1.16 - index / count) / 0.16);
        if (inSweep[index] && t < 1) sweepIncomplete = true;
        if (t === last[index]) continue;
        last[index] = t;

        const style = units[index].style;
        if (t >= 1) {
          style.removeProperty("color");
          style.removeProperty("opacity");
          style.removeProperty("filter");
          continue;
        }

        const finalColor = inSweep[index] ? sweepRest : rootColor;
        let color: RGB = GHOST;
        let opacity = 1;
        let blur = 0;
        if (t < 0.35) {
          const k = t / 0.35;
          opacity = k;
          blur = 8 - 6.5 * k;
        } else if (t < 0.7) {
          const k = (t - 0.35) / 0.35;
          color = mix(GHOST, accents[index], k);
          blur = 1.5 * (1 - k);
        } else {
          color = mix(accents[index], finalColor, (t - 0.7) / 0.3);
        }
        style.color = rgb(color);
        style.opacity = String(opacity);
        style.filter = blur > 0 ? `blur(${blur.toFixed(2)}px)` : "none";
      }

      if (!sweepHost) return;
      if (sweepIncomplete && !sweepRevealing) {
        sweepRevealing = true;
        sweepHost.setAttribute("data-revealing", "");
      } else if (!sweepIncomplete && sweepRevealing) {
        sweepRevealing = false;
        sweepHost.removeAttribute("data-revealing");
        playSweep(sweepHost);
      }
    };

    const reset = () => {
      units.forEach((unit) => {
        unit.style.removeProperty("color");
        unit.style.removeProperty("opacity");
        unit.style.removeProperty("filter");
      });
      sweepHost?.removeAttribute("data-revealing");
    };

    if (driver === "external" && progress) {
      paintRef.current = paint;
      paint(progress.get());
      return () => {
        paintRef.current = null;
        reset();
      };
    }

    if (driver === "scroll") {
      // Mesure hors du défilement : à l'arrivée et quand la page change de taille.
      let end = 1;
      const measure = () => {
        end = reachableProgress(root);
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(document.documentElement);
      window.addEventListener("resize", measure);
      const paintReachable = (value: number) => paint(end > 0 && end < 1 ? clamp01(value / end) : value);

      paintRef.current = paintReachable;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      paintReachable(clamp01((viewport * 0.92 - rect.top) / (viewport * 0.5)));
      return () => {
        paintRef.current = null;
        observer.disconnect();
        window.removeEventListener("resize", measure);
        reset();
      };
    }

    // Loader déjà effacé par son plafond CSS : le titre est visible, on le laisse.
    if (introMissed()) return;

    paint(0);
    let controls: AnimationPlaybackControls | undefined;
    const cancelWait = onSiteReady(() => {
      controls = animate(0, 1, {
        duration: LOAD_DURATION_S,
        delay,
        ease: "linear",
        onUpdate: paint,
        onComplete: () => paint(1),
      });
    });
    return () => {
      cancelWait();
      controls?.stop();
      reset();
    };
  }, [text, sweep, driver, progress, delay, reduced]);

  const sweepClasses = `${sweepClassName(tone)} ${sweepExtraClassName}`;
  const visual = splitOnSweep(text, sweep).map((segment, index) => {
    if (!segment.sweep) {
      return (
        <span key={index} aria-hidden="true">
          {renderWords(segment.text, `s${index}`)}
        </span>
      );
    }
    if (sweepWhole) {
      return (
        <span key={index} className={sweepClasses} data-sweep="" data-ch="" aria-hidden="true">
          {segment.text}
        </span>
      );
    }
    return (
      <span key={index} className={sweepClasses} data-sweep="" aria-hidden="true">
        {renderWords(segment.text, `s${index}`)}
      </span>
    );
  });

  if (Tag === "p") {
    return (
      <p ref={ref as RefObject<HTMLParagraphElement>} id={id} className={className}>
        <span className="sr-only">{text}</span>
        {visual}
      </p>
    );
  }

  return (
    <Tag ref={ref as RefObject<HTMLHeadingElement>} id={id} className={className} aria-label={text}>
      {visual}
    </Tag>
  );
}

"use client";

import {
  animate,
  useIsomorphicLayoutEffect,
  useMotionValueEvent,
  useScroll,
  type AnimationPlaybackControls,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

import { playSweep, sweepClassName, type SweepTone } from "@/components/motion/GradientSweep";
import { SPECTRUM_GOLD } from "@/lib/motion";
import { onSiteReady } from "@/lib/site-ready";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/motion-primitives.css";

type HeadingTag = "h1" | "h2" | "h3" | "h4";
type RGB = readonly [number, number, number];

/** Durée de la révélation au chargement (Orbix : 1 250 ms). */
const LOAD_DURATION_S = 1.25;
/** Plage de scroll : de « haut du titre à 92 % de l'écran » à « haut du titre à 42 % ». */
const SCROLL_OFFSET: ["start 0.92", "start 0.42"] = ["start 0.92", "start 0.42"];
/** Lettre fantôme de départ : sable (première couleur du spectre). */
const GHOST: RGB = SPECTRUM_GOLD[0];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function mix(from: RGB, to: RGB, k: number): RGB {
  return [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k, from[2] + (to[2] - from[2]) * k];
}

function spectrumAt(position: number): RGB {
  const scaled = clamp01(position) * (SPECTRUM_GOLD.length - 1);
  const index = Math.min(SPECTRUM_GOLD.length - 2, Math.floor(scaled));
  return mix(SPECTRUM_GOLD[index], SPECTRUM_GOLD[index + 1], scaled - index);
}

function parseRgb(color: string): RGB {
  const [r = 0, g = 0, b = 0] = (color.match(/[\d.]+/g) ?? []).map(Number);
  return [r, g, b];
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
 * Titre révélé lettre par lettre (signature d'Orbix, palette Cen21) :
 * chaque lettre passe du flou (8 px) à une couleur du spectre or, puis à la
 * couleur finale du titre, avec une fenêtre glissante de gauche à droite.
 *
 * - `mode="load"` : joue une fois (1,25 s) quand le loader du site s'efface,
 *   après `delay` secondes. Pour le titre du hero.
 * - `mode="scroll"` : suit la position du titre dans l'écran, dans les deux sens.
 * - `sweep` : portion du texte balayée en or à la fin de la révélation.
 *
 * Accessibilité : `aria-label` porte le texte, les lettres sont `aria-hidden`.
 * Le HTML serveur affiche le titre fini ; en reduced motion, rien n'est animé.
 */
export function SpectrumText({
  text,
  as: Tag = "h2",
  mode = "scroll",
  sweep,
  tone = "dark",
  delay = 0,
  id,
  className = "",
}: {
  text: string;
  as?: HeadingTag;
  mode?: "load" | "scroll";
  sweep?: string;
  tone?: SweepTone;
  delay?: number;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const paintRef = useRef<((progress: number) => void) | null>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: SCROLL_OFFSET });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (mode === "scroll") paintRef.current?.(progress);
  });

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;

    const chars = Array.from(root.querySelectorAll<HTMLElement>("[data-ch]"));
    const count = chars.length;
    if (!count) return;

    const sweepHost = root.querySelector<HTMLElement>("[data-sweep]");
    const inSweep = chars.map((char) => (sweepHost ? sweepHost.contains(char) : false));
    const accents = chars.map((_, index) => spectrumAt(index / Math.max(1, count - 1)));
    const finalColor = parseRgb(getComputedStyle(root).color);
    const last = new Float32Array(count).fill(-1);
    let sweepRevealing = false;

    const paint = (progress: number) => {
      let sweepIncomplete = false;
      for (let index = 0; index < count; index += 1) {
        const t = clamp01((progress * 1.16 - index / count) / 0.16);
        if (inSweep[index] && t < 1) sweepIncomplete = true;
        if (t === last[index]) continue;
        last[index] = t;

        const style = chars[index].style;
        if (t >= 1) {
          style.removeProperty("color");
          style.removeProperty("opacity");
          style.removeProperty("filter");
          continue;
        }

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
      chars.forEach((char) => {
        char.style.removeProperty("color");
        char.style.removeProperty("opacity");
        char.style.removeProperty("filter");
      });
      sweepHost?.removeAttribute("data-revealing");
    };

    if (mode === "scroll") {
      paintRef.current = paint;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      paint(clamp01((viewport * 0.92 - rect.top) / (viewport * 0.5)));
      return () => {
        paintRef.current = null;
        reset();
      };
    }

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
  }, [text, sweep, mode, delay, reduced]);

  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {splitOnSweep(text, sweep).map((segment, index) =>
        segment.sweep ? (
          <span key={index} className={sweepClassName(tone)} data-sweep="" aria-hidden="true">
            {renderWords(segment.text, `s${index}`)}
          </span>
        ) : (
          <span key={index} aria-hidden="true">
            {renderWords(segment.text, `s${index}`)}
          </span>
        ),
      )}
    </Tag>
  );
}

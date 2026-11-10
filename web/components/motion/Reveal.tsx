"use client";

import { motion, PresenceContext, useAnimationControls } from "framer-motion";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type Ref,
} from "react";

import { REDUCED_MOTION_QUERY } from "@/lib/use-media-query";

/**
 * `reveal.*` : `motion.*` dont la révélation au défilement (`initial` +
 * `whileInView`) joue aussi au premier chargement.
 *
 * Au premier chargement, la transition de page (RouteTransition,
 * `AnimatePresence initial={false}`) neutralise `initial` : tout est visible
 * dans le HTML serveur (rien n'attend le JavaScript, pas de retard sur le
 * LCP), mais les révélations ne jouaient qu'après une navigation interne.
 * Ici, au montage, un élément encore sous l'écran reprend son état `initial`
 * (hors champ, donc sans flash) et `whileInView` le révèle à son arrivée. Un
 * élément déjà à l'écran reste tel quel. Après une navigation interne, rien ne
 * change : `initial` s'applique comme d'habitude.
 *
 * - Reduced motion : rien n'est masqué.
 * - Un élément qui a aussi `animate` est rendu tel quel : les contrôles
 *   remplaceraient son animation.
 * - La marge du `viewport` ne doit pas déborder sous l'écran (marge basse
 *   positive) : l'élément serait déjà « vu » avant d'être masqué.
 *
 * Même principe qu'AnimateIn (components/ui/AnimateIn.tsx), pour les
 * révélations aux valeurs propres à un composant.
 */

const TAGS = [
  "a",
  "article",
  "button",
  "div",
  "figure",
  "form",
  "h1",
  "h2",
  "h3",
  "li",
  "p",
  "path",
  "section",
  "span",
  "svg",
  "ul",
] as const;

type RevealTag = (typeof TAGS)[number];
type RevealProps<T extends RevealTag> = ComponentProps<(typeof motion)[T]>;
type Definition = Parameters<ReturnType<typeof useAnimationControls>["start"]>[0];

type ControlledProps = {
  initial?: unknown;
  animate?: unknown;
  whileInView?: unknown;
  ref?: Ref<Element>;
};

function createReveal<T extends RevealTag>(tag: T) {
  const Base = motion[tag] as unknown as ComponentType<RevealProps<T>>;

  function Reveal(props: RevealProps<T>) {
    const { initial, animate, whileInView, ref } = props as ControlledProps;
    const presence = useContext(PresenceContext);
    const controls = useAnimationControls();
    const node = useRef<Element | null>(null);
    // Décidé au montage, comme le fait Framer.
    const [blocked] = useState(() => presence?.initial === false);
    const managed =
      blocked &&
      animate === undefined &&
      whileInView !== undefined &&
      initial !== undefined &&
      typeof initial !== "boolean";

    // Une seule fois, au montage : l'état de départ du premier chargement.
    const initialAtMount = useRef(managed ? initial : undefined);
    useEffect(() => {
      const element = node.current;
      const from = initialAtMount.current;
      if (!element || from === undefined) return;
      if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
      if (element.getBoundingClientRect().top > window.innerHeight) {
        // Animation instantanée et non `controls.set` : une valeur que Framer
        // ne suivait pas encore (ici toutes, `initial` ayant été neutralisé)
        // est enregistrée sans redessiner l'élément, qui resterait visible.
        void controls.start(from as Definition, { duration: 0 });
      }
    }, [controls]);

    const setNode = useCallback(
      (element: Element | null) => {
        node.current = element;
        if (typeof ref === "function") ref(element);
        else if (ref) (ref as { current: Element | null }).current = element;
      },
      [ref],
    );

    const forwarded = {
      ...props,
      ref: setNode,
      animate: managed ? controls : animate,
    } as RevealProps<T>;
    return <Base {...forwarded} />;
  }

  Reveal.displayName = `reveal.${tag}`;
  return Reveal;
}

type RevealComponents = { [T in RevealTag]: ReturnType<typeof createReveal<T>> };

export const reveal = Object.fromEntries(
  TAGS.map((tag) => [tag, createReveal(tag)]),
) as RevealComponents;

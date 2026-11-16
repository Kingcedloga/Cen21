"use client";

import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

import "@/styles/olive.css";

/** Tige du rameau (viewBox 0 0 200 520), du bas vers le haut. */
const STEM = "M 112 512 C 96 430 120 360 100 290 C 82 226 112 160 96 92 C 90 64 96 38 104 12";
/** Feuilles : position sur la tige, angle (> 180 : côté gauche), taille ; apparaissent dans l'ordre. */
const LEAVES = [
  { x: 108, y: 452, r: -38, s: 1 },
  { x: 106, y: 410, r: 212, s: 0.95 },
  { x: 108, y: 352, r: -46, s: 1.08 },
  { x: 104, y: 300, r: 220, s: 1 },
  { x: 96, y: 246, r: -34, s: 0.92 },
  { x: 100, y: 196, r: 218, s: 1.05 },
  { x: 102, y: 146, r: -42, s: 0.9 },
  { x: 96, y: 100, r: 210, s: 0.85 },
  { x: 98, y: 58, r: -30, s: 0.75 },
  { x: 102, y: 26, r: 204, s: 0.65 },
];
/** Olives, accrochées entre les feuilles. */
const OLIVES = [
  { x: 128, y: 386, r: 20 },
  { x: 78, y: 268, r: -16 },
  { x: 124, y: 168, r: 12 },
];
/** Hauteur de chute (unités du viewBox) : la feuille part du haut de la section. */
const DROP = 300;
/** Dérive latérale au départ et amplitude du balancement (unités du viewBox). */
const DRIFT = 80;
const SWAY = 16;
/** Tours effectués pendant la chute (degrés). */
const SPIN = 260;
/** Part de la piste pendant laquelle une feuille tombe. */
const FALL = 0.22;

/** Feuille en amande, pointe vers la droite (origine : sa base). */
const LEAF = "M 0 0 C 14 -11 40 -12 62 0 C 40 12 14 11 0 0 Z";

/**
 * Rameau d'olivier qui se compose au fil du défilement : la tige se trace du
 * bas vers le haut, et les feuilles tombent du haut de la section, en se
 * balançant et en tournoyant, pour se poser chacune à sa place sur la tige
 * (de la plus basse à la plus haute, au rythme du tracé) ; les olives
 * apparaissent ensuite. Lié au défilement : rien ne bouge seul.
 * `progress` : 0 → 1, fourni par la section.
 * `still` : rameau complet, immobile (reduced motion).
 */
export function OliveBranch({
  progress,
  still,
  className = "",
}: {
  progress: MotionValue<number>;
  still: boolean;
  className?: string;
}) {
  const draw = useTransform(progress, [0, 0.7], [0, 1], { clamp: true });

  return (
    <svg aria-hidden="true" viewBox="0 0 200 520" className={`olive-branch ${className}`}>
      <motion.path d={STEM} className="olive-branch__stem" style={{ pathLength: still ? 1 : draw }} />
      {LEAVES.map((leaf, index) => (
        <FallingLeaf key={index} leaf={leaf} index={index} progress={progress} from={0.04 + index * 0.06} still={still} />
      ))}
      {OLIVES.map((olive, index) => (
        <Piece key={`o${index}`} progress={progress} at={0.4 + index * 0.12} still={still}>
          <ellipse cx={olive.x} cy={olive.y} rx="9" ry="12.5" transform={`rotate(${olive.r} ${olive.x} ${olive.y})`} className="olive-branch__olive" />
        </Piece>
      ))}
    </svg>
  );
}

/** Une feuille ou une olive : apparaît (fondu et grossissement) à son tour. */
function Piece({
  progress,
  at,
  still,
  children,
}: {
  progress: MotionValue<number>;
  at: number;
  still: boolean;
  children: ReactNode;
}) {
  const shown = useTransform(progress, [at, at + 0.08], [0, 1], { clamp: true });
  const scale = useTransform(shown, [0, 1], [0.4, 1]);
  return (
    <motion.g className="olive-branch__piece" style={still ? { opacity: 1, scale: 1 } : { opacity: shown, scale }}>
      {children}
    </motion.g>
  );
}

type LeafSpot = (typeof LEAVES)[number];

/** Pose finale de la feuille sur la tige. */
const restingTransform = (leaf: LeafSpot) => `translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`;

/**
 * Une feuille qui tombe jusqu'à sa place : part du haut (décalée d'un côté,
 * en alternance), descend en ralentissant, se balance et tournoie, puis se
 * pose dans son angle sur la tige. La transformation SVG est écrite
 * directement dans l'attribut (pas de rendu à chaque image).
 */
function FallingLeaf({
  leaf,
  index,
  progress,
  from,
  still,
}: {
  leaf: LeafSpot;
  index: number;
  progress: MotionValue<number>;
  from: number;
  still: boolean;
}) {
  const ref = useRef<SVGGElement>(null);
  const t = useTransform(progress, [from, from + FALL], [0, 1], { clamp: true });
  const opacity = useTransform(t, [0, 0.12], [0, 1]);
  const side = index % 2 === 0 ? 1 : -1;

  const transformAt = (k: number) => {
    // Chute qui ralentit à l'arrivée (easeOutCubic).
    const eased = 1 - (1 - k) ** 3;
    const rest = 1 - eased;
    const x = leaf.x + side * DRIFT * rest + Math.sin(k * Math.PI * 3) * SWAY * (1 - k);
    const y = leaf.y - DROP * rest;
    const r = leaf.r + side * SPIN * rest;
    return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(1)}) scale(${leaf.s})`;
  };

  useMotionValueEvent(t, "change", (k) => {
    if (!still) ref.current?.setAttribute("transform", transformAt(k));
  });

  return (
    <motion.g style={still ? { opacity: 1 } : { opacity }}>
      <g ref={ref} transform={still ? restingTransform(leaf) : transformAt(t.get())}>
        <path d={LEAF} className="olive-branch__leaf" />
        <path d="M 4 0 L 56 0" className="olive-branch__vein" />
      </g>
    </motion.g>
  );
}

"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef, type Ref } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { StatCountUp } from "@/components/sections/StatCountUp";
import { MOBILE_QUERY, SPRING } from "@/lib/motion";
import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

type Value = { title: string; description: string };
type Stat = { value: string; label: string };

/** Apparition des pastilles (part de la piste) et inclinaison. Orbix incline
 *  jusqu'à ±5° des pastilles éparses ; en grille, ±3° évite que les rangées
 *  se chevauchent. */
const PILL_AT = [0.18, 0.27, 0.36, 0.45, 0.54, 0.63] as const;
const PILL_ROTATE = [-2.5, 3, -2, 2.5, -3, 2] as const;
const PILL_FADE = 0.06;
/** Mobile : la pastille apparaît quand son haut passe de 95 % à 65 % de l'écran. */
const PILL_REVEAL_OFFSET = ["start 0.95", "start 0.65"] as const;

function ValuePill({
  value,
  index,
  progress,
  from,
  to,
  isStatic,
  tracked = true,
  ref,
}: {
  value: Value;
  index: number;
  progress: MotionValue<number>;
  /** Fenêtre d'apparition dans `progress`. */
  from: number;
  to: number;
  isStatic: boolean;
  /** Animée par la piste : neutralisée par la CSS quand celle-ci est statique. */
  tracked?: boolean;
  ref?: Ref<HTMLLIElement>;
}) {
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  // Transformation en fonction (et non en plage) : Framer ne la délègue pas à
  // l'animation native liée au scroll, dont l'opacité ne suit pas la piste.
  const appear = useTransform(progress, (value) => Math.min(1, Math.max(0, (value - from) / (to - from))));
  // Ressort ≈ back.out(2) : léger dépassement à l'arrivée.
  const settle = useSpring(appear, { stiffness: SPRING.backOut.stiffness, damping: SPRING.backOut.damping });
  const scale = useTransform(settle, (value) => 0.5 + value * 0.5);
  const y = useTransform(settle, (value) => 28 * (1 - value));

  return (
    <motion.li
      ref={ref}
      data-track-motion={tracked ? "" : undefined}
      style={isStatic ? undefined : { opacity: appear, scale, y }}
    >
      {/* Déplaçable à la souris, retour élastique (Orbix : elastic.out(1, .45)). */}
      <motion.div
        drag={finePointer && !isStatic}
        dragSnapToOrigin
        dragElastic={0.4}
        dragTransition={{ bounceStiffness: SPRING.elastic.stiffness, bounceDamping: SPRING.elastic.damping }}
        whileDrag={{ scale: 1.08 }}
        style={{ rotate: PILL_ROTATE[index % PILL_ROTATE.length] }}
        className={`h-full rounded-[1.25rem] bg-ivory px-5 py-3 text-petrol-panel-4 shadow-long ${
          finePointer && !isStatic ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <p className="title-section text-base">{value.title}</p>
        <p className="mt-1 text-xs leading-snug text-petrol-panel-4/75">{value.description}</p>
      </motion.div>
    </motion.li>
  );
}

/**
 * Mobile (phase 4 bis) : la piste n'est pas épinglée ; chaque pastille suit
 * sa propre entrée dans l'écran, avec le même ressort que sur desktop.
 */
function RevealPill({ value, index }: { value: Value; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: [...PILL_REVEAL_OFFSET] });
  return (
    <ValuePill
      ref={ref}
      value={value}
      index={index}
      progress={scrollYProgress}
      from={0}
      to={1}
      isStatic={false}
      tracked={false}
    />
  );
}

function ManifestoStage({
  eyebrow,
  statement,
  values,
  valuesLabel,
}: {
  eyebrow: string;
  statement: string;
  values: Value[];
  valuesLabel: string;
}) {
  const { progress, isStatic } = useStickyTrack();
  const textProgress = useTransform(progress, [0.04, 0.7], [0, 1]);
  const mobile = useMediaQuery(MOBILE_QUERY);
  const reduced = useReducedMotionSafe();
  // Après hydratation seulement : le HTML serveur garde les pastilles visibles.
  const reveal = mobile && !reduced;

  return (
    // Non épinglé (mobile, reduced motion) : marge haute plus grande, au-delà
    // du débord du séparateur fondu qui précède la section.
    <div
      className={`relative flex min-h-full flex-col justify-center px-4 md:px-8 ${
        isStatic ? "pb-14 pt-24 md:pb-16 md:pt-28" : "py-14 md:py-16"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, color-mix(in srgb, var(--color-gold) 9%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-5xl">
        <p id="home-manifesto-title" className="eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {eyebrow}
        </p>
        <SpectrumText
          as="p"
          text={statement}
          progress={isStatic ? undefined : textProgress}
          mode="scroll"
          className="title-section mt-5 text-[clamp(1.5rem,0.95rem+1.9vw,2.75rem)] leading-[1.18] text-ivory"
        />

        {/* 6 valeurs : grille 3 × 2 (desktop), 2 × 3 (tablette), 1 colonne (mobile). */}
        <ul
          aria-label={valuesLabel}
          className="mt-8 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-x-5"
        >
          {values.map((value, index) => {
            if (reveal) return <RevealPill key={value.title} value={value} index={index} />;
            const at = PILL_AT[index % PILL_AT.length];
            return (
              <ValuePill
                key={value.title}
                value={value}
                index={index}
                progress={progress}
                from={at}
                to={at + PILL_FADE}
                isStatic={isStatic}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * Manifeste épinglé (Orbix : section « about » épinglée 2 200 px) : le
 * positionnement du groupe se révèle lettre à lettre au fil du défilement et
 * les valeurs arrivent en pastilles inclinées. Les chiffres clés suivent,
 * hors de la zone épinglée (la scène tient ainsi sur les écrans bas).
 * Mobile : section ordinaire, les pastilles arrivent au défilement.
 * Reduced motion ou écran trop bas : section ordinaire, tout est affiché.
 */
export function HomeManifesto({
  eyebrow,
  statement,
  values,
  stats,
  valuesLabel,
  statsLabel,
}: {
  eyebrow: string;
  statement: string;
  values: Value[];
  stats: Stat[];
  valuesLabel: string;
  statsLabel: string;
}) {
  return (
    <>
      <StickyTrack
        lengthVh={300}
        staticBelow="md"
        surface="dark"
        ariaLabelledby="home-manifesto-title"
        className="bg-petrol-panel-4"
      >
        <ManifestoStage eyebrow={eyebrow} statement={statement} values={values} valuesLabel={valuesLabel} />
      </StickyTrack>

      <div data-surface="dark" className="bg-petrol-panel-4 px-4 pb-20 md:px-8 md:pb-24">
        <dl
          aria-label={statsLabel}
          className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-6 border-t border-ivory/10 pt-8 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-ivory/65">{stat.label}</dt>
              <dd className="title-section text-h3 tabular-nums text-gold">
                <StatCountUp value={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

"use client";

import { motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { keyframes, TRACK_VH } from "@/lib/motion";
import type { SubsidiaryNightStep } from "@/lib/types";

import "@/styles/club.css";

/**
 * La nuit heure par heure : piste épinglée (aussi sur mobile) où les étapes
 * de 18h à 06h défilent à l'horizontale. L'heure courante s'affiche en grand,
 * une jauge avance d'une heure à l'autre et un halo doré monte jusqu'au cœur
 * de la nuit puis retombe. Reduced motion : étapes empilées, sans piste.
 */
export function ClubNight({ steps }: { steps: SubsidiaryNightStep[] }) {
  if (steps.length === 0) return null;
  const extra = Math.max(0, steps.length - 4);
  return (
    <StickyTrack
      lengthVh={TRACK_VH.universes + extra * TRACK_VH.universesExtraCard}
      mobileLengthVh={TRACK_VH.universesMobile + extra * TRACK_VH.universesMobileExtraCard}
      surface="dark"
      ariaLabelledby="club-night-title"
      className="club-night"
    >
      <ClubNightStage steps={steps} />
    </StickyTrack>
  );
}

function ClubNightStage({ steps }: { steps: SubsidiaryNightStep[] }) {
  const t = useTranslations("club");
  const { progress, isStatic } = useStickyTrack();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const distance = useMotionValue(0);
  const [current, setCurrent] = useState(0);

  // Course horizontale = ce qui dépasse de l'écran (remesurée au redimensionnement).
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => distance.set(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [distance]);

  // Pause en début et en fin de piste (8 %), course entre les deux.
  const travel = useTransform(progress, (v) => keyframes(v, [0.08, 0.92], [0, 1]));
  const x = useTransform(() => -distance.get() * travel.get());
  const gauge = useTransform(travel, (v) => `scaleX(${v.toFixed(4)})`);
  // Halo : monte jusqu'au milieu de la nuit, retombe à la fermeture.
  const glow = useTransform(travel, (v) => keyframes(v, [0, 0.5, 1], [0.15, 0.85, 0.2]));

  useMotionValueEvent(travel, "change", (v) => {
    setCurrent(Math.min(steps.length - 1, Math.round(v * (steps.length - 1))));
  });

  return (
    <div className={`club-night__stage ${isStatic ? "is-static" : ""}`}>
      <motion.div aria-hidden="true" className="club-night__glow" style={isStatic ? undefined : { opacity: glow }} data-track-motion />

      <header className="club-night__head">
        <div>
          <p className="club-eyebrow">{t("nightEyebrow")}</p>
          <h2 id="club-night-title" className="club-night__title">
            {t("nightTitle")}
          </h2>
        </div>
        {!isStatic && (
          <p aria-hidden="true" className="club-night__clock">
            <motion.span key={steps[current].hour} initial={{ opacity: 0, y: "40%" }} animate={{ opacity: 1, y: "0%" }} transition={{ duration: 0.35 }}>
              {steps[current].hour}
            </motion.span>
          </p>
        )}
      </header>

      <div ref={viewportRef} className="club-night__viewport">
        <motion.ol ref={trackRef} className="club-night__track" style={isStatic ? undefined : { x }} data-track-motion>
          {steps.map((step, index) => (
            <li key={step.hour} className={`club-night__step ${!isStatic && index === current ? "is-current" : ""}`}>
              <span aria-hidden="true" className="club-night__hour">
                {step.hour}
              </span>
              <figure className="club-night__figure">
                <Image src={step.image.src} alt={step.image.alt} fill sizes="(min-width: 768px) 30vw, 70vw" className="object-cover" />
              </figure>
              <div className="club-night__text">
                <h3 className="club-night__step-title">
                  <span className="sr-only">{step.hour} — </span>
                  {step.title}
                </h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </motion.ol>
      </div>

      {!isStatic && (
        <div aria-hidden="true" className="club-night__gauge">
          <span className="club-night__gauge-label">{steps[0].hour}</span>
          <span className="club-night__gauge-bar">
            <motion.span className="club-night__gauge-fill" style={{ transform: gauge }} />
          </span>
          <span className="club-night__gauge-label">{steps[steps.length - 1].hour}</span>
        </div>
      )}
    </div>
  );
}

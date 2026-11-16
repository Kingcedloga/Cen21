"use client";

import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { keyframes } from "@/lib/motion";

import "@/styles/mexicana.css";

/** Étage de la salle (Matrix Tower). */
const FLOOR = 9;
/** Rendu statique : valeurs fixes explicites. */
const STILL_LEFT = { x: "-100%" };
const STILL_RIGHT = { x: "100%" };
const STILL_PHOTO = { scale: 1 };
const STILL_FADE = { opacity: 1 };

/**
 * « Au 9ᵉ étage » : un ascenseur de la Matrix Tower, épinglé. Au défilement,
 * l'indicateur monte d'étage en étage jusqu'au 9ᵉ, puis les portes de laiton
 * s'écartent sur la salle vitrée du restaurant, et la légende apparaît.
 * Épinglé aussi sur mobile. Reduced motion : portes ouvertes, section non
 * épinglée.
 */
export function MexicanaElevator({ image, imageAlt }: { image: string; imageAlt: string }) {
  return (
    <StickyTrack lengthVh={260} mobileLengthVh={220} surface="dark" ariaLabelledby="mexicana-elevator-title" className="mx-elevator-track">
      <ElevatorStage image={image} imageAlt={imageAlt} />
    </StickyTrack>
  );
}

function ElevatorStage({ image, imageAlt }: { image: string; imageAlt: string }) {
  const t = useTranslations("mexicana");
  const { progress, isStatic } = useStickyTrack();
  const [floor, setFloor] = useState(0);

  // 0,05 → 0,5 : la montée ; 0,52 → 0,78 : les portes ; puis la légende.
  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.round(keyframes(value, [0.05, 0.5], [0, FLOOR]));
    setFloor((previous) => (previous === next ? previous : next));
  });
  const left = useTransform(progress, (v) => `${keyframes(v, [0.52, 0.78], [0, -100])}%`);
  const right = useTransform(progress, (v) => `${keyframes(v, [0.52, 0.78], [0, 100])}%`);
  const photoScale = useTransform(progress, (v) => keyframes(v, [0.52, 0.9], [1.12, 1]));
  const caption = useTransform(progress, (v) => keyframes(v, [0.76, 0.88], [0, 1]));
  // L'invitation à défiler s'efface quand les portes s'ouvrent.
  const hint = useTransform(progress, (v) => keyframes(v, [0.44, 0.54], [1, 0]));
  const shown = isStatic ? FLOOR : floor;

  return (
    <div className={`mx-elevator ${isStatic ? "is-static" : ""}`}>
      <div className="mx-elevator__head">
        <p className="mx-eyebrow">{t("elevatorEyebrow")}</p>
        <h2 id="mexicana-elevator-title" className="mx-title">
          {t("elevatorTitle")}
        </h2>
      </div>

      <div className="mx-elevator__car">
        {/* Indicateur d'étage, au-dessus des portes. */}
        <div className="mx-elevator__dial" aria-hidden="true">
          <span className="mx-elevator__dial-label">{t("elevatorFloor")}</span>
          <span className="mx-elevator__dial-num">{shown}</span>
          <span className="mx-elevator__dial-arrow" data-up={shown < FLOOR ? "" : undefined}>
            ▲
          </span>
        </div>

        <div className="mx-elevator__shaft">
          <motion.div className="mx-elevator__photo" style={isStatic ? STILL_PHOTO : { scale: photoScale }}>
            <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 70vw, 92vw" className="object-cover" />
          </motion.div>
          <motion.div aria-hidden="true" className="mx-elevator__door mx-elevator__door--left" style={isStatic ? STILL_LEFT : { x: left }} />
          <motion.div aria-hidden="true" className="mx-elevator__door mx-elevator__door--right" style={isStatic ? STILL_RIGHT : { x: right }} />
        </div>

        <motion.p className="mx-elevator__caption" style={isStatic ? STILL_FADE : { opacity: caption }}>
          {t("elevatorText")}
        </motion.p>
        {!isStatic && (
          <motion.p aria-hidden="true" className="mx-elevator__hint" style={{ opacity: hint }}>
            {t("elevatorHint")}
          </motion.p>
        )}
      </div>
    </div>
  );
}

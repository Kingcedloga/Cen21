"use client";

import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Pause, Play, Volume2, VolumeX } from "@/lib/icons";
import { keyframes } from "@/lib/motion";
import type { HeroVideo } from "@/lib/types";
import { useTeaserVideo } from "@/lib/use-teaser-video";

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
 * s'écartent sur le teaser de la maison, et la légende apparaît.
 * Épinglé aussi sur mobile. Reduced motion : portes ouvertes, section non
 * épinglée.
 *
 * Teaser (useTeaserVideo) : demandé à l'approche de la section, lu muet en
 * boucle tant qu'il est à l'écran ; boutons lecture / pause (WCAG 2.2.2) et
 * son, au-dessus des portes.
 */
export function MexicanaElevator({ video, label }: { video: HeroVideo; label: string }) {
  return (
    <StickyTrack lengthVh={260} mobileLengthVh={220} surface="dark" ariaLabelledby="mexicana-elevator-title" className="mx-elevator-track">
      <ElevatorStage video={video} label={label} />
    </StickyTrack>
  );
}

function ElevatorStage({ video, label }: { video: HeroVideo; label: string }) {
  const t = useTranslations("mexicana");
  const tFiliale = useTranslations("filiale");
  const tCommon = useTranslations("common");
  const { progress, isStatic } = useStickyTrack();
  const [floor, setFloor] = useState(0);
  // Le teaser ne joue qu'au 9ᵉ étage (rendu statique : toujours au 9ᵉ).
  const atTop = isStatic || floor === FLOOR;
  const { near, playing, muted, frameRef, videoRef, videoProps, togglePlay, toggleSound } = useTeaserVideo({ enabled: atTop });

  // En quittant le 9ᵉ étage, la vidéo revient au début : elle recommence à la prochaine arrivée.
  useEffect(() => {
    const element = videoRef.current;
    if (!atTop && element && element.currentTime > 0) element.currentTime = 0;
  }, [atTop, videoRef]);
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

        {/* La cabine prend le format de la vidéo (9:16) et toute la hauteur disponible. */}
        <div className="mx-elevator__well">
        <div ref={frameRef} className="mx-elevator__shaft">
          <motion.div className="mx-elevator__photo" style={isStatic ? STILL_PHOTO : { scale: photoScale }}>
            <video {...videoProps} className="mx-elevator__video" aria-label={label} poster={video.poster}>
              {near && video.webm && <source src={video.webm} type="video/webm" />}
              {near && <source src={video.src} type="video/mp4" />}
            </video>
          </motion.div>
          <motion.div aria-hidden="true" className="mx-elevator__door mx-elevator__door--left" style={isStatic ? STILL_LEFT : { x: left }} />
          <motion.div aria-hidden="true" className="mx-elevator__door mx-elevator__door--right" style={isStatic ? STILL_RIGHT : { x: right }} />
          <div className="mx-elevator__controls">
            <button
              type="button"
              className="mx-hero__toggle mx-elevator__toggle tap-press"
              aria-label={playing ? tCommon("videoPause") : tCommon("videoPlay")}
              onClick={togglePlay}
            >
              {playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
            </button>
            <button
              type="button"
              className="mx-hero__toggle mx-elevator__toggle tap-press"
              aria-label={muted ? tFiliale("teaserSoundOn") : tFiliale("teaserSoundOff")}
              aria-pressed={!muted}
              onClick={toggleSound}
            >
              {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>
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

"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { keyframes, TRACK_VH } from "@/lib/motion";
import type { SocialLinks as SocialLinksType } from "@/lib/types";

import "@/styles/home-burst.css";

/**
 * Photos de la scène, dans l'ordre d'Orbix (« wave-image-1 » à « -10 ») :
 * position dans la scène, largeur à 1 440 px, projection (px à 1 440 px de
 * large) atteinte à `moveEnd`, agrandissement final éventuel.
 */
const CARDS = [
  { place: { top: "6%", left: "20%" }, w: 240, ratio: "4 / 3", move: [-700, -300], moveEnd: 0.57 },
  { place: { top: "15%", left: "5%" }, w: 270, ratio: "5 / 4", move: [-300, -500], moveEnd: 0.7, wideOnly: true },
  { place: { bottom: "45%", left: "8%" }, w: 244, ratio: "1 / 1", move: [-400, 0], moveEnd: 0.7 },
  { place: { bottom: "23%", left: "22%" }, w: 220, ratio: "4 / 5", move: [-700, 100], moveEnd: 0.57, scale: 2, front: true },
  { place: { bottom: "11%", left: "12%" }, w: 290, ratio: "4 / 3", move: [-500, 200], moveEnd: 0.7 },
  { place: { top: "15%", right: "18%" }, w: 280, ratio: "5 / 4", move: [500, -600], moveEnd: 0.7, scale: 1.5 },
  { place: { top: "5%", right: "5%" }, w: 220, ratio: "1 / 1", move: [700, -200], moveEnd: 0.57 },
  { place: { bottom: "42%", right: "10%" }, w: 290, ratio: "4 / 3", move: [400, -400], moveEnd: 0.7, scale: 1.3, front: true },
  { place: { bottom: "32%", right: "1%" }, w: 260, ratio: "4 / 5", move: [200, 200], moveEnd: 0.7 },
  { place: { bottom: "16%", right: "16%" }, w: 240, ratio: "4 / 3", move: [500, 300], moveEnd: 0.7 },
] as const;

/** Keyframes du groupe (IX2 « a-300 ») : apparition au centre, gonflement, envol. */
const GROUP_SCALE = { stops: [0.25, 0.5, 0.75], values: [0.1, 1.2, 2] } as const;
const GROUP_OPACITY = { stops: [0.25, 0.32, 0.7, 0.75], values: [0, 1, 1, 0] } as const;
const MOVE_FROM = 0.38;
const SCALE_FROM = 0.32;

/** Les projections d'Orbix sont en px pour 1 440 px de large : converties en vw. */
const vw = (px: number) => `${(px / 14.4).toFixed(3)}vw`;

/** Largeur d'Orbix à 1 440 px, proportionnelle au viewport, bornée pour la
 *  tablette et les très grands écrans. */
const cardWidth = (px: number) => `clamp(${Math.round(px * 0.62)}px, ${vw(px)}, ${Math.round(px * 1.3)}px)`;

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
  index,
  src,
  progress,
}: {
  index: number;
  src: string;
  progress: MotionValue<number>;
}) {
  const card = CARDS[index];
  const scaleTo = "scale" in card ? card.scale : 1;
  const x = useTransform(progress, (v) => vw(keyframes(v, [MOVE_FROM, card.moveEnd], [0, card.move[0]])));
  const y = useTransform(progress, (v) => vw(keyframes(v, [MOVE_FROM, card.moveEnd], [0, card.move[1]])));
  const scale = useTransform(progress, (v) => keyframes(v, [SCALE_FROM, 0.7], [1, scaleTo]));

  return (
    <motion.div
      className={`burst-card shadow-long ${"wideOnly" in card ? "burst-card--wide-only" : ""} ${"front" in card ? "z-[1]" : ""}`}
      style={{ ...card.place, width: cardWidth(card.w), aspectRatio: card.ratio, x, y, scale }}
    >
      <Image src={src} alt="" fill sizes="(max-width: 1440px) 20vw, 300px" className="object-cover" />
    </motion.div>
  );
}

function BurstCanvas({ images, progress }: { images: BurstImage[]; progress: MotionValue<number> }) {
  const scale = useTransform(progress, (v) => keyframes(v, GROUP_SCALE.stops, GROUP_SCALE.values));
  const opacity = useTransform(progress, (v) => keyframes(v, GROUP_OPACITY.stops, GROUP_OPACITY.values));

  return (
    <div aria-hidden="true" className="burst-canvas">
      <motion.div className="absolute inset-0" style={{ scale, opacity }}>
        {images.slice(0, CARDS.length).map((image, index) => (
          <BurstCard key={`${image.src}-${index}`} index={index} src={image.src} progress={progress} />
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

  return (
    <div className={`relative flex min-h-full items-center justify-center px-4 md:px-8 ${isStatic ? "py-24 md:py-28" : ""}`}>
      {!isStatic && <BurstCanvas images={images} progress={progress} />}

      <div className="burst-shuttle">
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <p className="eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
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
 * « Un groupe, dix univers » (Orbix : section « hero_track », piste de 240 vh).
 * Les photos des filiales jaillissent du centre, s'écartent puis s'envolent
 * autour d'un message fixe. Mobile, reduced motion : le message seul.
 */
export function HomeUniverseBurst(props: BurstProps) {
  return (
    <StickyTrack
      lengthVh={TRACK_VH.burst}
      staticBelow="md"
      surface="dark"
      ariaLabelledby="home-burst-title"
      className="bg-petrol-panel-4"
    >
      <BurstStage {...props} />
    </StickyTrack>
  );
}

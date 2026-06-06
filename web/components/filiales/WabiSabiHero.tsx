"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { cormorant } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import { fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import type { SubsidiaryHeroSection } from "@/lib/types";

import "@/styles/wabi-sabi-hero.css";

type Props = {
  name: string;
  hero: SubsidiaryHeroSection;
  backgroundVideo?: {
    src: string;
    webm?: string;
    poster?: string;
  };
};

export function WabiSabiHero({ name, hero, backgroundVideo }: Props) {
  const reduced = useReducedMotion() ?? false;
  const { image, imageAlt } = hero;
  const poster = backgroundVideo?.poster ?? image;
  const useVideo = Boolean(backgroundVideo?.src) && !reduced;
  const stageImage = useVideo ? poster : image;

  const cardMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: fadeUpVariants,
        transition: { ...fadeUpTransition, delay: 0.06 },
      };

  return (
    <header className={`wabi-sabi-hero ${cormorant.variable}`}>
      <div className="wabi-sabi-hero__backdrop" aria-hidden>
        <span className="wabi-sabi-hero__texture" />
        <span className="wabi-sabi-hero__grain" />
        <span className="wabi-sabi-hero__glow wabi-sabi-hero__glow--tl" />
        <span className="wabi-sabi-hero__glow wabi-sabi-hero__glow--br" />
      </div>

      <div className="wabi-sabi-hero__inner">
        <h1 className="sr-only">{name}</h1>

        <motion.div className="wabi-sabi-hero__card" {...cardMotion}>
          <div className="wabi-sabi-hero__frame">
            {useVideo ? (
              <video
                className="wabi-sabi-hero__media wabi-sabi-hero__media--video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={poster}
                aria-label={imageAlt}
              >
                {backgroundVideo?.webm ? (
                  <source src={backgroundVideo.webm} type="video/webm" />
                ) : null}
                <source src={backgroundVideo!.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={stageImage}
                alt={imageAlt}
                fill
                priority
                placeholder="blur"
                blurDataURL={BLUR_PETROL}
                className="wabi-sabi-hero__media"
                sizes="(max-width: 767px) 96vw, (max-width: 1200px) 92vw, 104rem)"
                quality={92}
              />
            )}
            <span className="wabi-sabi-hero__frame-shine" aria-hidden />
            <span className="wabi-sabi-hero__frame-vignette" aria-hidden />
          </div>
        </motion.div>
      </div>
    </header>
  );
}

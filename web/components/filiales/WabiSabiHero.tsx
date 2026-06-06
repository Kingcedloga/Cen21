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
  brandLogo?: string;
  hero: SubsidiaryHeroSection;
  backgroundVideo?: {
    src: string;
    webm?: string;
    poster?: string;
  };
};

export function WabiSabiHero({ name, brandLogo, hero, backgroundVideo }: Props) {
  const reduced = useReducedMotion() ?? false;
  const { image, imageAlt, quote, attribution } = hero;
  const poster = backgroundVideo?.poster ?? image;
  const useVideo = Boolean(backgroundVideo?.src) && !reduced;
  const stageImage = useVideo ? poster : image;
  const showQuote = Boolean(quote?.trim());

  const cardMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: fadeUpVariants,
        transition: { ...fadeUpTransition, delay: 0.06 },
      };

  const logoMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: fadeUpVariants,
        transition: fadeUpTransition,
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
          {brandLogo ? (
            <motion.div className="wabi-sabi-hero__brand" {...logoMotion}>
              <span className="wabi-sabi-hero__logo-badge">
                <Image
                  src={brandLogo}
                  alt={name}
                  width={520}
                  height={144}
                  className="wabi-sabi-hero__logo"
                  priority
                />
              </span>
            </motion.div>
          ) : null}

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
                sizes="(max-width: 767px) 92vw, (max-width: 1200px) 86vw, 80rem"
                quality={92}
              />
            )}
            <span className="wabi-sabi-hero__frame-shine" aria-hidden />
            <span className="wabi-sabi-hero__frame-vignette" aria-hidden />
          </div>
        </motion.div>

        {showQuote ? (
          <motion.blockquote
            className="wabi-sabi-hero__quote"
            {...(reduced
              ? {}
              : {
                  initial: "hidden" as const,
                  animate: "visible" as const,
                  variants: fadeUpVariants,
                  transition: { ...fadeUpTransition, delay: 0.16 },
                })}
          >
            <p>{quote}</p>
            {attribution ? (
              <footer className="wabi-sabi-hero__attribution">{attribution}</footer>
            ) : null}
          </motion.blockquote>
        ) : null}
      </div>
    </header>
  );
}

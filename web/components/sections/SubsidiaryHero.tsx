"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { useCallback, useEffect, useRef, useState } from "react";

import { SocialLinks } from "@/components/ui/SocialLinks";
import { BLUR_PETROL } from "@/lib/image-blur";
import { fadeUpTransition, fadeUpVariants, heroStaggerVariants } from "@/lib/motion";
import { useHeroScrollProgress } from "@/lib/use-hero-scroll-progress";
import type { SubsidiaryHeroContent, SubsidiaryHeroLayout } from "@/lib/subsidiary-hero-layout";
import type { SubsidiaryPageTheme } from "@/lib/subsidiary-themes";

import { SubsidiaryHeroLogo } from "./SubsidiaryHeroLogo";

import type { HeroVideo, SocialLinks as SocialLinksData } from "@/lib/types";

type Slide = { src: string; alt: string };

type SubsidiaryHeroTheme = Pick<SubsidiaryPageTheme, "colors" | "hero">;

export function SubsidiaryHero({
  slides,
  sectorLabel,
  name,
  tagline,
  social,
  brandLogo,
  accentColor,
  theme,
  backgroundVideo,
  layout = "default",
  contentConfig = {},
}: {
  slides: Slide[];
  sectorLabel: string;
  name: string;
  tagline: string;
  social: SocialLinksData;
  brandLogo?: string;
  accentColor?: string;
  theme?: SubsidiaryHeroTheme;
  backgroundVideo?: HeroVideo;
  layout?: SubsidiaryHeroLayout;
  contentConfig?: SubsidiaryHeroContent;
}) {
  const list = slides.filter((s) => s.src);
  const len = list.length;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const logoReveal = useHeroScrollProgress(heroRef);
  const isThemed = Boolean(theme);
  const isCinematic = layout === "cinematic-center";
  const hideSectorLabel = contentConfig.hideSectorLabel ?? false;
  const hideTitle = contentConfig.hideTitle ?? false;
  const logoSize =
    contentConfig.logoSize ?? (isCinematic ? "cinematic" : "default");
  const isEditorialTagline = contentConfig.taglineVariant === "editorial";
  const isCompactTypography = contentConfig.typographyScale === "compact";
  const imageQuality = contentConfig.imageQuality;
  const videoRef = useRef<HTMLVideoElement>(null);
  const useVideoBackground = Boolean(backgroundVideo?.src) && !reduced;
  const posterSrc =
    backgroundVideo?.poster ?? list[0]?.src ?? backgroundVideo?.src ?? "";

  const safeIndex = len ? index % len : 0;
  const next = useCallback(() => setIndex((i) => (len ? (i + 1) % len : 0)), [len]);
  const prev = useCallback(() => setIndex((i) => (len ? (i - 1 + len) % len : 0)), [len]);

  useEffect(() => {
    if (reduced || len <= 1) return;
    const t = window.setInterval(next, 6000);
    return () => window.clearInterval(t);
  }, [reduced, len, next]);

  useEffect(() => {
    if (!useVideoBackground) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, [useVideoBackground, backgroundVideo?.src]);

  const hasLogo = Boolean(brandLogo);

  if (!len && !backgroundVideo?.src) return null;

  const defaultOverlay =
    "linear-gradient(to top, #004258 0%, transparent 55%), linear-gradient(90deg, rgba(0,66,88,0.5) 0%, transparent 40%)";

  const dotActiveClass = isThemed ? "w-7 bg-[var(--sub-gold)]" : "w-7 bg-gold";
  const dotIdleClass = isThemed
    ? "w-1.5 bg-white/35 hover:bg-white/60"
    : "w-1.5 bg-ivory/40 hover:bg-ivory/70";
  const navButtonClass = isThemed
    ? "absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[var(--sub-border)] bg-black/55 p-2.5 text-white backdrop-blur-sm transition-colors hover:border-[rgb(var(--sub-gold-rgb)/0.55)] hover:text-[var(--sub-gold)] cursor-pointer hidden sm:flex"
    : "absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-petrol/40 p-2.5 text-ivory backdrop-blur-sm transition-colors hover:bg-petrol/70 hover:text-gold cursor-pointer hidden sm:flex";
  const navButtonRightClass = navButtonClass.replace("left-2", "right-2");

  return (
    <section
      ref={heroRef}
      className={`subsidiary-hero relative flex min-h-svh h-svh overflow-hidden ${
        isCinematic
          ? "subsidiary-hero--cinematic items-center justify-center"
          : "items-end"
      }${hideTitle && brandLogo ? " subsidiary-hero--brand-minimal" : ""}`}
    >
      {useVideoBackground ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover ${
            isCinematic ? "subsidiary-hero__video--cinematic" : ""
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterSrc || undefined}
          aria-hidden
        >
          {backgroundVideo?.webm && (
            <source src={backgroundVideo.webm} type="video/webm" />
          )}
          <source src={backgroundVideo!.src} type="video/mp4" />
        </video>
      ) : (
        list.map((slide, i) => (
          <div
            key={`${slide.src}-${i}`}
            className={`absolute inset-0 transition-opacity duration-hero-crossfade ease-out ${
              i === safeIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== safeIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              placeholder="blur"
              blurDataURL={theme?.hero.blurTint ?? BLUR_PETROL}
              className="object-cover"
              sizes="100vw"
              {...(imageQuality != null ? { quality: imageQuality } : {})}
            />
          </div>
        ))
      )}

      {backgroundVideo?.src && reduced && posterSrc && (
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={posterSrc}
            alt=""
            fill
            priority
            placeholder="blur"
            blurDataURL={theme?.hero.blurTint ?? BLUR_PETROL}
            className="object-cover"
            sizes="100vw"
            {...(imageQuality != null ? { quality: imageQuality } : {})}
          />
        </div>
      )}

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: theme?.hero.overlayGradient ?? defaultOverlay,
        }}
      />

      {isThemed && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-gradient-to-r from-transparent via-[var(--sub-gold)] to-transparent opacity-60"
        />
      )}

      {len > 1 && !useVideoBackground && (
        <>
          <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center gap-2 md:bottom-28">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Visuel ${i + 1} sur ${len}`}
                aria-current={i === safeIndex}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-base cursor-pointer ${
                  i === safeIndex ? dotActiveClass : dotIdleClass
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={prev}
            className={navButtonClass}
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className={navButtonRightClass}
            aria-label="Image suivante"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <motion.div
        className={`relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 ${
          isCinematic
            ? "subsidiary-hero__content--cinematic flex flex-col items-center justify-center text-center"
            : "pb-14 pt-28 md:pb-20 md:pt-36"
        }`}
        data-has-logo={hasLogo ? "" : undefined}
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        variants={reduced ? undefined : heroStaggerVariants}
      >
        {brandLogo && (
          <motion.div
            className={`flex ${
              isCinematic
                ? hideTitle
                  ? "mb-8 justify-center md:mb-10 lg:mb-12"
                  : "mb-6 justify-center md:mb-8"
                : isCompactTypography
                  ? "mb-4 justify-start md:mb-6"
                  : "mb-6 justify-start md:mb-10"
            }`}
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            <SubsidiaryHeroLogo
              src={brandLogo}
              alt={name}
              reveal={logoReveal}
              accentColor={accentColor}
              align={isCinematic ? "center" : "left"}
              size={logoSize}
            />
          </motion.div>
        )}
        {!hideSectorLabel && (
          <motion.p
            className={`uppercase ${
              isCompactTypography
                ? "mb-2.5 text-[10px] tracking-[0.2em] md:text-xs md:tracking-[0.18em]"
                : "mb-3 text-xs tracking-[0.22em] md:text-sm md:tracking-[0.2em]"
            } ${isThemed ? "text-[var(--sub-gold)]" : "text-gold"}`}
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            {sectorLabel}
          </motion.p>
        )}
        {hideTitle ? (
          <h1 className="sr-only">{name}</h1>
        ) : (
          <motion.h1
            className={`mb-3 font-[family-name:var(--font-dm-sans)] ${
              hasLogo
                ? isCinematic
                  ? isCompactTypography
                    ? "text-xl font-medium tracking-[0.07em] md:text-2xl lg:text-[1.65rem]"
                    : "text-2xl font-medium tracking-[0.08em] md:text-3xl lg:text-[2rem]"
                  : isCompactTypography
                    ? "text-lg font-medium tracking-[0.05em] md:text-xl lg:text-2xl"
                    : "text-xl font-medium tracking-[0.06em] md:text-2xl lg:text-[1.75rem]"
                : isCompactTypography
                  ? "text-3xl font-bold tracking-[-0.02em] md:text-4xl"
                  : "text-4xl font-bold tracking-[-0.02em] md:text-5xl"
            } ${isThemed ? "text-white" : "text-ivory"}`}
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            {name}
          </motion.h1>
        )}
        <motion.p
          className={`mb-6 ${
            isEditorialTagline
              ? "subsidiary-hero__tagline subsidiary-hero__tagline--editorial max-w-2xl text-lg font-bold leading-snug tracking-[0.015em] sm:text-xl md:text-2xl lg:max-w-3xl lg:text-[1.65rem] lg:leading-snug"
              : isCompactTypography
                ? `text-sm leading-relaxed md:text-base ${isCinematic ? "max-w-lg" : "max-w-xl"}`
                : `text-base leading-relaxed md:text-lg ${isCinematic ? "max-w-xl" : "max-w-2xl"}`
          } ${isThemed ? "text-white/90" : "text-ivory/80"}`}
          variants={reduced ? undefined : fadeUpVariants}
          transition={fadeUpTransition}
        >
          {tagline}
        </motion.p>
        <motion.div
          className={isCinematic ? "flex justify-center" : undefined}
          variants={reduced ? undefined : fadeUpVariants}
          transition={fadeUpTransition}
        >
          <SocialLinks social={social} label="Suivez-nous" />
        </motion.div>
      </motion.div>
    </section>
  );
}

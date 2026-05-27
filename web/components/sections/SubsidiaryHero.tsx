"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { useCallback, useEffect, useState } from "react";

import { SocialLinks } from "@/components/ui/SocialLinks";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { SubsidiaryPageTheme } from "@/lib/subsidiary-themes";

import type { SocialLinks as SocialLinksData } from "@/lib/types";

type Slide = { src: string; alt: string };

type SubsidiaryHeroTheme = Pick<SubsidiaryPageTheme, "colors" | "hero">;

export function SubsidiaryHero({
  slides,
  sectorLabel,
  name,
  tagline,
  social,
  brandLogo,
  theme,
}: {
  slides: Slide[];
  sectorLabel: string;
  name: string;
  tagline: string;
  social: SocialLinksData;
  brandLogo?: string;
  theme?: SubsidiaryHeroTheme;
}) {
  const list = slides.filter((s) => s.src);
  const len = list.length;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const isThemed = Boolean(theme);

  const safeIndex = len ? index % len : 0;
  const next = useCallback(() => setIndex((i) => (len ? (i + 1) % len : 0)), [len]);
  const prev = useCallback(() => setIndex((i) => (len ? (i - 1 + len) % len : 0)), [len]);

  useEffect(() => {
    if (reduced || len <= 1) return;
    const t = window.setInterval(next, 6000);
    return () => window.clearInterval(t);
  }, [reduced, len, next]);

  if (!len) return null;

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
    <section className="subsidiary-hero relative flex min-h-svh h-svh items-end overflow-hidden">
      {list.map((slide, i) => (
        <div
          key={`${slide.src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
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
          />
        </div>
      ))}

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

      {len > 1 && (
        <>
          <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center gap-2 md:bottom-28">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Visuel ${i + 1} sur ${len}`}
                aria-current={i === safeIndex}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 md:px-10 md:pb-20 md:pt-36">
        {brandLogo && (
          <div className="mb-6 flex justify-start md:mb-8">
            <Image
              src={brandLogo}
              alt=""
              width={220}
              height={80}
              className="h-12 w-auto object-contain md:h-14"
              priority
            />
          </div>
        )}
        <p
          className={`mb-3 text-sm uppercase tracking-[0.2em] ${
            isThemed ? "text-[var(--sub-gold)]" : "text-gold"
          }`}
        >
          {sectorLabel}
        </p>
        <h1
          className={`mb-4 text-5xl md:text-6xl ${
            isThemed ? "text-white" : "text-ivory"
          }`}
        >
          {name}
        </h1>
        <p
          className={`mb-6 max-w-2xl text-xl ${
            isThemed ? "text-white/80" : "text-ivory/80"
          }`}
        >
          {tagline}
        </p>
        <SocialLinks social={social} label="Suivez-nous" />
      </div>
    </section>
  );
}

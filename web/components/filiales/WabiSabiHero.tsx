"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { useCallback, useEffect, useState } from "react";

import { BLUR_PETROL } from "@/lib/image-blur";

type Slide = { src: string; alt: string };

export function WabiSabiHero({
  slides,
  name,
  tagline,
  brandLogo,
}: {
  slides: Slide[];
  name: string;
  tagline: string;
  brandLogo: string;
}) {
  const list = slides.filter((s) => s.src);
  const len = list.length;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion() ?? false;

  const safeIndex = len ? index % len : 0;
  const next = useCallback(() => setIndex((i) => (len ? (i + 1) % len : 0)), [len]);
  const prev = useCallback(() => setIndex((i) => (len ? (i - 1 + len) % len : 0)), [len]);

  useEffect(() => {
    if (reduced || len <= 1) return;
    const t = window.setInterval(next, 7000);
    return () => window.clearInterval(t);
  }, [reduced, len, next]);

  if (!len) return null;

  const fadeClass = reduced ? "" : "transition-opacity duration-1000 ease-out";

  return (
    <section
      className="wabi-sabi-hero relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-2"
      aria-labelledby="wabi-sabi-hero-title"
    >
      {/* Gauche — visuel bord à bord, sans padding */}
      <div className="relative min-h-[48svh] lg:min-h-[100svh]">
        {list.map((slide, i) => (
          <div
            key={`${slide.src}-${i}`}
            className={`absolute inset-0 ${fadeClass} ${
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
              blurDataURL={BLUR_PETROL}
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-[var(--sub-bg)]/25 lg:to-[var(--sub-bg)]/40"
        />

        {len > 1 && (
          <>
            <div className="absolute bottom-6 left-6 z-20 flex gap-2 lg:bottom-10 lg:left-10">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Visuel ${i + 1} sur ${len}`}
                  aria-current={i === safeIndex}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    i === safeIndex
                      ? "w-7 bg-[var(--sub-gold)]"
                      : "w-1.5 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={prev}
              className="wabi-sabi-hero-nav absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 sm:flex lg:left-6"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              className="wabi-sabi-hero-nav absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 sm:flex lg:right-6"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* Séparateur vertical doré */}
      <div
        aria-hidden
        className="wabi-sabi-hero-divider pointer-events-none absolute bottom-0 left-1/2 top-0 z-10 hidden w-px -translate-x-1/2 lg:block"
      />

      {/* Droite — logo, titre, sous-titre */}
      <div className="wabi-sabi-hero-panel relative flex min-h-[52svh] items-center lg:min-h-[100svh]">
        <div className="wabi-sabi-hero-content mx-auto w-full px-8 py-16 sm:px-12 lg:px-14 xl:px-20">
          <div className="mb-9 lg:mb-11">
            <Image
              src={brandLogo}
              alt=""
              width={260}
              height={96}
              className="h-[3.25rem] w-auto object-contain sm:h-16 lg:h-[4.75rem]"
              priority
            />
          </div>

          <h1
            id="wabi-sabi-hero-title"
            className="wabi-sabi-hero-title mb-6 font-[family-name:var(--font-dm-sans)] text-[clamp(2.125rem,4.8vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em] text-[var(--sub-gold)]"
          >
            {name}
          </h1>

          <p className="font-[family-name:var(--font-inter)] text-[clamp(1.0625rem,2.1vw,1.375rem)] font-light leading-[1.7] tracking-[0.015em] text-[var(--sub-text-muted)]">
            {tagline}
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { BLUR_PETROL } from "@/lib/image-blur";

export type HeroSlide = {
  src: string;
  alt: string;
};

type HeroCinematicProps = {
  slides: HeroSlide[];
  tagline: string;
  description: string;
  eyebrow?: string;
};

const AUTO_MS = 7000;

export function HeroCinematic({
  slides,
  tagline,
  description,
  eyebrow,
}: HeroCinematicProps) {
  const t = useTranslations("hero");
  const resolvedEyebrow = eyebrow ?? t("eyebrow");
  const list = slides;

  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion() ?? false;

  const len = list.length;
  const safeIndex = len ? index % len : 0;

  if (len === 0) {
    return (
      <section className="relative flex min-h-[50vh] items-end bg-petrol px-6 pb-24 pt-36 md:pt-40">
        <div className="max-w-4xl">
          <p className="text-gold text-sm tracking-[0.25em] uppercase">{resolvedEyebrow}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-ivory mt-4">
            {tagline}
          </h1>
          <p className="text-taupe text-lg max-w-2xl mt-4">{description}</p>
        </div>
      </section>
    );
  }

  const next = useCallback(() => {
    setIndex((i) => (len ? (i + 1) % len : 0));
  }, [len]);

  const prev = useCallback(() => {
    setIndex((i) => (len ? (i - 1 + len) % len : 0));
  }, [len]);

  useEffect(() => {
    if (reducedMotion || len <= 1) return;
    const t = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(t);
  }, [reducedMotion, len, next]);

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden">
      {list.map((slide, i) => (
        <div
          key={`${slide.src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === safeIndex ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
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
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      <div
        className="absolute inset-0 z-[1]"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(11,36,41,0.55) 0%, rgba(11,36,41,0.25) 35%, rgba(11,36,41,0.65) 70%, rgba(11,36,41,0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_20%_80%,rgba(197,160,89,0.18)_0%,transparent_55%)]"
        aria-hidden
      />

      {len > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-petrol/50 p-3 text-ivory backdrop-blur-sm transition-colors hover:bg-petrol/80 hover:text-gold cursor-pointer hidden md:flex"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-petrol/50 p-3 text-ivory backdrop-blur-sm transition-colors hover:bg-petrol/80 hover:text-gold cursor-pointer hidden md:flex"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-28 md:pb-32 pt-36 md:pt-40">
        <div className="max-w-4xl space-y-5 md:space-y-7">
          <div className="inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-transparent to-gold/85" />
            <p className="text-gold text-[11px] font-semibold tracking-[0.32em] uppercase">
              {resolvedEyebrow}
            </p>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-ivory leading-[1.04] tracking-[-0.02em] [text-shadow:_0_2px_36px_rgb(0_0_0_/_0.45)]">
            {tagline}
          </h1>
          <p className="text-ivory/85 text-lg md:text-xl max-w-2xl leading-[1.65] pt-1 [text-shadow:_0_1px_14px_rgb(0_0_0_/_0.4)]">
            {description}
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 pt-3 md:pt-5">
            <Button href="/filiales">{t("ctaSubsidiaries")}</Button>
            <Button href="/contact" variant="secondary">
              {t("ctaContact")}
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: window.innerHeight - 60,
            behavior: reducedMotion ? "auto" : "smooth",
          })
        }
        aria-label={t("scrollAria")}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-ivory/70 transition-colors duration-200 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 cursor-pointer md:flex md:bottom-10"
      >
        <span className="text-[10px] font-medium tracking-[0.24em] uppercase">
          {t("scroll")}
        </span>
        <span
          aria-hidden
          className="relative flex h-10 w-6 items-center justify-center rounded-full border border-ivory/30"
        >
          <span className="animate-scroll-cue absolute top-1.5 h-2 w-1 rounded-full bg-gold" />
        </span>
      </button>
    </section>
  );
}

"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

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
  eyebrow = "Holding lifestyle premium",
}: HeroCinematicProps) {
  const list = slides;

  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const len = list.length;
  const safeIndex = len ? index % len : 0;

  if (len === 0) {
    return (
      <section className="relative flex min-h-[50vh] items-end bg-petrol px-6 pb-24 pt-36 md:pt-40">
        <div className="max-w-4xl">
          <p className="text-gold text-sm tracking-[0.25em] uppercase">{eyebrow}</p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl font-light text-ivory mt-4">
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
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-petrol via-petrol/70 to-petrol/30" />

      {len > 1 && (
        <>
          <div className="absolute bottom-28 left-4 right-4 z-20 flex justify-center gap-2 md:bottom-36">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1} sur ${len}`}
                aria-current={i === safeIndex}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === safeIndex
                    ? "w-8 bg-gold"
                    : "w-2 bg-ivory/40 hover:bg-ivory/70"
                }`}
              />
            ))}
          </div>
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
          <p className="text-gold text-[11px] font-medium tracking-[0.28em] uppercase drop-shadow-sm">
            {eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl lg:text-8xl font-light text-ivory leading-[1.04] tracking-[-0.02em] [text-shadow:_0_2px_36px_rgb(0_0_0_/_0.38)]">
            {tagline}
          </h1>
          <p className="text-taupe/95 text-lg md:text-xl max-w-2xl leading-[1.65] pt-1 [text-shadow:_0_1px_14px_rgb(0_0_0_/_0.35)]">
            {description}
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 pt-3 md:pt-5">
            <Button href="/filiales">Découvrir nos filiales</Button>
            <Button href="/contact" variant="secondary">
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

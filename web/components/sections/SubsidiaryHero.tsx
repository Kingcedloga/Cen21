"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { SocialLinks } from "@/components/ui/SocialLinks";

import type { SocialLinks as SocialLinksData } from "@/lib/types";

type Slide = { src: string; alt: string };

export function SubsidiaryHero({
  slides,
  sectorLabel,
  name,
  tagline,
  social,
}: {
  slides: Slide[];
  sectorLabel: string;
  name: string;
  tagline: string;
  social: SocialLinksData;
}) {
  const list = slides.filter((s) => s.src);
  const len = list.length;
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const safeIndex = len ? index % len : 0;
  const next = useCallback(() => setIndex((i) => (len ? (i + 1) % len : 0)), [len]);
  const prev = useCallback(() => setIndex((i) => (len ? (i - 1 + len) % len : 0)), [len]);

  useEffect(() => {
    if (reduced || len <= 1) return;
    const t = window.setInterval(next, 6000);
    return () => window.clearInterval(t);
  }, [reduced, len, next]);

  if (!len) return null;

  return (
    <section className="relative min-h-[60vh] flex items-end overflow-hidden">
      {list.map((slide, i) => (
        <div
          key={`${slide.src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === safeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
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

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(to top, #0B2429 0%, transparent 55%), linear-gradient(90deg, rgba(11,36,41,0.5) 0%, transparent 40%)`,
        }}
      />

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
                  i === safeIndex ? "w-7 bg-gold" : "w-1.5 bg-ivory/40 hover:bg-ivory/70"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-petrol/40 p-2.5 text-ivory backdrop-blur-sm transition-colors hover:bg-petrol/70 hover:text-gold cursor-pointer hidden sm:flex"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-petrol/40 p-2.5 text-ivory backdrop-blur-sm transition-colors hover:bg-petrol/70 hover:text-gold cursor-pointer hidden sm:flex"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-14 md:pb-20 pt-28 md:pt-36">
        <p className="text-gold text-sm tracking-[0.2em] uppercase mb-3">{sectorLabel}</p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-ivory mb-4">
          {name}
        </h1>
        <p className="text-xl text-taupe max-w-2xl mb-6">{tagline}</p>
        <SocialLinks social={social} label="Suivez-nous" />
      </div>
    </section>
  );
}

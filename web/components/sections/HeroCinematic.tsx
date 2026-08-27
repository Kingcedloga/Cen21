"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { dynalight } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import { DURATION_S, EASE, fadeUpTransition, fadeUpVariants, heroStaggerVariants } from "@/lib/motion";

export type HeroSlide = {
  src: string;
  alt: string;
};

type HeroCinematicProps = {
  slides: HeroSlide[];
  siteName: string;
  className?: string;
};

const AUTO_MS = 7000;

export function HeroCinematic({ slides, siteName, className = "" }: HeroCinematicProps) {
  const t = useTranslations("hero");
  const list = slides;

  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion() ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.7]);

  const len = list.length;
  const safeIndex = len ? index % len : 0;

  const next = useCallback(() => {
    setIndex((i) => (len ? (i + 1) % len : 0));
  }, [len]);

  const prev = useCallback(() => {
    setIndex((i) => (len ? (i - 1 + len) % len : 0));
  }, [len]);

  useEffect(() => {
    if (reducedMotion || len <= 1) return;
    const timer = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, len, next]);

  if (len === 0) {
    return (
      <section className="relative flex min-h-[50vh] items-end bg-petrol px-6 pb-24 pt-36 md:pt-40">
        <h1 className="sr-only">{siteName}</h1>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <Button href="/filiales">{t("ctaSubsidiaries")}</Button>
          <Button href="/contact" variant="secondary">
            {t("ctaContact")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`relative flex h-[clamp(220px,60dvh,520px)] shrink-0 items-end overflow-hidden ${dynalight.variable} ${className}`}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={reducedMotion ? undefined : { y: imageY }}
      >
        {list.map((slide, i) => (
          <div
            key={`${slide.src}-${i}`}
            className={`absolute inset-0 h-[115%] transition-opacity duration-hero-crossfade ease-out ${
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
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-t from-petrol via-petrol/40 to-transparent"
        style={reducedMotion ? undefined : { opacity: overlayOpacity }}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: 1 }}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury }}
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-12 md:pb-14 pt-28 md:pt-32">
        <h1 className="sr-only">{siteName}</h1>
        <motion.div
          className="flex flex-col gap-5 md:gap-6"
          initial={reducedMotion ? false : "hidden"}
          animate={reducedMotion ? undefined : "visible"}
          variants={reducedMotion ? undefined : heroStaggerVariants}
        >
          <motion.p
            className="eyebrow text-[14px] font-bold uppercase text-gold sm:text-[15px] [font-family:var(--font-dynalight),cursive]"
            variants={reducedMotion ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            {t("tagline")}
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 md:gap-4"
            variants={reducedMotion ? undefined : fadeUpVariants}
            transition={{ ...fadeUpTransition, delay: 0.12 }}
          >
            <Button href="/filiales">{t("ctaSubsidiaries")}</Button>
            <Button href="/contact" variant="secondary">
              {t("ctaContact")}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => {
          const target = document.getElementById("nos-filiales");
          target?.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }}
        aria-label={t("scrollAria")}
        className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-ivory/70 transition-colors duration-fine hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 cursor-pointer md:flex md:bottom-5"
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

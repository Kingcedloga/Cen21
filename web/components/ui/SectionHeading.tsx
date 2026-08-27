"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

import { dynalight } from "@/lib/fonts";
import {
  defaultScrollViewport,
  ornamentDiamondTransition,
  ornamentDiamondVariants,
  ornamentLineTransition,
  ornamentLineVariants,
} from "@/lib/motion";

type Tone = "dark" | "light";

const toneStyles: Record<
  Tone,
  {
    line: string;
    diamond: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
  }
> = {
  dark: {
    line: "bg-gradient-to-r from-transparent to-gold/85",
    diamond: "bg-gold/85 shadow-[0_0_10px_rgba(212,173,101,0.55)]",
    eyebrow: "text-gold",
    title: "text-ivory",
    subtitle: "text-gradient-gold opacity-95",
    description: "text-ivory/80",
  },
  light: {
    line: "bg-gradient-to-r from-transparent to-gold-deep/75",
    diamond: "bg-gold-deep/90 shadow-[0_0_8px_rgba(161,123,53,0.35)]",
    eyebrow: "text-gold-deep",
    title: "text-petrol",
    subtitle: "text-gradient-petrol-gold",
    description: "text-taupe",
  },
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  align = "center",
  tone = "dark",
  titleAs: TitleTag = "h2",
  subtitleAs: SubtitleTag = "h3",
  titleId,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string | ReactNode;
  align?: "left" | "center";
  tone?: Tone;
  titleAs?: "h1" | "h2" | "h3";
  subtitleAs?: "h2" | "h3" | "p";
  titleId?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const isCenter = align === "center";
  const Title = TitleTag as ElementType;
  const Subtitle = SubtitleTag as ElementType;
  const styles = toneStyles[tone];

  const lineMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: defaultScrollViewport,
        variants: ornamentLineVariants,
        transition: ornamentLineTransition,
      };

  const diamondMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: defaultScrollViewport,
        variants: ornamentDiamondVariants,
        transition: { ...ornamentDiamondTransition, delay: 0.06 },
      };

  return (
    <header
      className={`max-w-3xl mb-10 md:mb-12 ${dynalight.variable} ${
        isCenter ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {eyebrow && (
        <div
          className={`mb-5 flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 ${
            isCenter ? "justify-center" : "justify-start"
          }`}
        >
          <motion.span
            aria-hidden
            className={`block h-px w-7 shrink-0 sm:w-9 ornament-line-glow ${styles.line}`}
            style={{ transformOrigin: isCenter ? "right center" : "left center" }}
            {...lineMotion}
          />
          <motion.span
            aria-hidden
            className={`inline-flex h-1.5 w-1.5 shrink-0 rotate-45 ${styles.diamond}`}
            {...diamondMotion}
          />
          <p
            className={`eyebrow text-[14px] font-bold uppercase sm:text-[15px] [font-family:var(--font-dynalight),cursive] ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>
          {isCenter && (
            <>
              <motion.span
                aria-hidden
                className={`inline-flex h-1.5 w-1.5 shrink-0 rotate-45 ${styles.diamond}`}
                {...diamondMotion}
              />
              <motion.span
                aria-hidden
                className={`block h-px w-7 shrink-0 bg-gradient-to-l from-transparent sm:w-9 ornament-line-glow ${
                  tone === "light" ? "to-gold-deep/75" : "to-gold/85"
                }`}
                style={{ transformOrigin: "left center" }}
                initial={reduced ? false : "hidden"}
                whileInView={reduced ? undefined : "visible"}
                viewport={defaultScrollViewport}
                variants={ornamentLineVariants}
                transition={{ ...ornamentLineTransition, delay: 0.04 }}
              />
            </>
          )}
        </div>
      )}
      <Title
        id={titleId}
        className={`font-[family-name:var(--font-dm-sans)] text-4xl md:text-5xl lg:text-[3.4rem] font-bold tracking-[-0.028em] leading-[1.05] ${styles.title}`}
      >
        {title}
      </Title>
      {subtitle && (
        <Subtitle
          className={`mt-3 font-[family-name:var(--font-dm-sans)] text-2xl md:text-[1.85rem] italic font-bold tracking-[-0.012em] leading-[1.15] ${
            isCenter ? "mx-auto" : ""
          } ${styles.subtitle}`}
        >
          {subtitle}
        </Subtitle>
      )}
      {description && (
        <p
          className={`mt-5 text-[15px] md:text-base lg:text-lg leading-[1.75] tracking-[-0.005em] max-w-2xl ${
            isCenter ? "mx-auto" : ""
          } ${styles.description}`}
        >
          {description}
        </p>
      )}
    </header>
  );
}

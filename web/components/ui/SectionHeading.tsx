"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { dynalight } from "@/lib/fonts";
import {
  defaultScrollViewport,
  ornamentDiamondTransition,
  ornamentDiamondVariants,
  ornamentLineTransition,
  ornamentLineVariants,
} from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

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
    line: "bg-gradient-to-r from-transparent to-rose/85",
    diamond: "bg-rose/85 shadow-[0_0_10px_rgba(212,160,135,0.55)]",
    eyebrow: "text-rose",
    title: "text-ivory",
    subtitle: "text-gradient-rose opacity-95",
    description: "text-ivory/80",
  },
  light: {
    line: "bg-gradient-to-r from-transparent to-rose-deep/75",
    diamond: "bg-rose-deep/90 shadow-[0_0_8px_rgba(161,123,53,0.35)]",
    eyebrow: "text-rose-deep",
    title: "text-petrol",
    subtitle: "text-gradient-petrol-rose",
    // Pétrole à 80 % : 4,8:1 sur le sable (le taupe n'y atteignait que 1,6:1).
    description: "text-petrol/80",
  },
};

/**
 * En-tête de section.
 *
 * `look="classic"` (défaut) : eyebrow cursive entre deux filets, titre fixe.
 * `look="editorial"` (refonte R0, sections de l'accueil) : étiquette simple en
 * capitales, titre révélé lettre à lettre au défilement (SpectrumText), avec
 * `sweep`, la partie du titre balayée d'or à la fin de la révélation.
 */
export function SectionHeading({
  eyebrow,
  title,
  look = "classic",
  sweep,
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
  look?: "classic" | "editorial";
  sweep?: string;
  subtitle?: string;
  description?: string | ReactNode;
  align?: "left" | "center";
  tone?: Tone;
  titleAs?: "h1" | "h2" | "h3";
  subtitleAs?: "h2" | "h3" | "p";
  titleId?: string;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
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

  const subtitleBlock = subtitle && (
    <Subtitle
      className={`mt-3 font-[family-name:var(--font-dm-sans)] text-xl sm:text-2xl md:text-[1.85rem] italic font-bold tracking-[-0.015em] leading-[1.15] ${
        isCenter ? "mx-auto" : ""
      } ${styles.subtitle}`}
    >
      {subtitle}
    </Subtitle>
  );
  // Éditorial sur fond sable : petits textes en pétrole (contraste ≥ 4,5 ;
  // l'or profond et le taupe y restent sous le seuil).
  const editorialLight = look === "editorial" && tone === "light";
  const descriptionBlock = description && (
    <p
      className={`mt-5 text-[15px] md:text-base lg:text-lg leading-[1.8] tracking-[-0.005em] max-w-2xl text-pretty ${
        isCenter ? "mx-auto" : ""
      } ${editorialLight ? "text-petrol-panel-4/80" : styles.description}`}
    >
      {description}
    </p>
  );

  if (look === "editorial") {
    return (
      <header className={`max-w-4xl mb-12 md:mb-16 ${isCenter ? "mx-auto text-center" : "text-left"} ${className}`}>
        {eyebrow && (
          <p
            className={`eyebrow text-xs font-semibold uppercase tracking-[0.2em] ${editorialLight ? "text-petrol" : styles.eyebrow}`}
          >
            {eyebrow}
          </p>
        )}
        <SpectrumText
          as={TitleTag}
          id={titleId}
          mode="scroll"
          text={title}
          sweep={sweep}
          tone={tone === "light" ? "light" : "dark"}
          className={`title-section text-h2 text-balance ${eyebrow ? "mt-4" : ""} ${isCenter ? "mx-auto" : ""} ${styles.title}`}
        />
        {subtitleBlock}
        {descriptionBlock}
      </header>
    );
  }

  return (
    <header
      className={`max-w-4xl mb-12 md:mb-16 ${dynalight.variable} ${
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
            className={`block h-px w-8 shrink-0 sm:w-12 ornament-line-glow ${styles.line}`}
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
                className={`block h-px w-8 shrink-0 bg-gradient-to-l from-transparent sm:w-12 ornament-line-glow ${
                  tone === "light" ? "to-rose-deep/75" : "to-rose/85"
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
        className={`font-[family-name:var(--font-dm-sans)] text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.032em] leading-[1.04] ${styles.title}`}
      >
        {title}
      </Title>
      {subtitleBlock}
      {descriptionBlock}
    </header>
  );
}

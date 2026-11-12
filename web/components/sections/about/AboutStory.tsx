"use client";

import { useTransform } from "framer-motion";
import type { ReactNode } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";

import "@/styles/about.css";

type StoryProps = {
  eyebrow: string;
  title: string;
  statement: string;
  /** `light` : chapitre Quartz (À propos) ; `dark` : fond de la maison (fiches). */
  tone?: "light" | "dark";
  titleId?: string;
  /** Signe au-dessus de l'étiquette (ex. logo de la maison sur une fiche). */
  mark?: ReactNode;
};

function StoryStage({ eyebrow, title, statement, tone = "light", titleId = "about-story-title", mark }: StoryProps) {
  const { progress, isStatic } = useStickyTrack();
  const textProgress = useTransform(progress, [0.06, 0.78], [0, 1]);

  return (
    <div className={`about-story about-story--${tone} ${isStatic ? "about-story--static" : ""}`}>
      <div className="mx-auto w-full max-w-5xl">
        {mark && <div className="about-story__mark">{mark}</div>}
        <p className="about-story__eyebrow">{eyebrow}</p>
        <h2 id={titleId} className="about-story__title">
          {title}
        </h2>
        <SpectrumText
          as="p"
          text={statement}
          progress={isStatic ? undefined : textProgress}
          mode="scroll"
          className="about-story__statement title-section"
        />
      </div>
    </div>
  );
}

/**
 * Histoire épinglée (refonte R2, même mécanique que le manifeste de
 * l'accueil, Orbix : section « about » épinglée) : sur fond sable, l'histoire
 * du groupe se révèle lettre à lettre au fil du défilement.
 * Mobile, reduced motion ou écran trop bas : section ordinaire, révélation
 * au défilement (statique en reduced motion).
 */
export function AboutStory(props: StoryProps) {
  const dark = props.tone === "dark";
  return (
    <StickyTrack
      lengthVh={220}
      staticBelow="md"
      surface={dark ? "dark" : "light"}
      ariaLabelledby={props.titleId ?? "about-story-title"}
      className={dark ? "bg-petrol-panel-4" : "bg-[var(--surface-light)]"}
    >
      <StoryStage {...props} />
    </StickyTrack>
  );
}

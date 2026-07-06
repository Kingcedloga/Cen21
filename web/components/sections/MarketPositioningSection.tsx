"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { Building2, Check, Play } from "@/lib/icons";
import { DURATION_S, EASE } from "@/lib/motion";

import "@/styles/market-positioning.css";

type Strength = { title: string; description: string };
type Founder  = { name: string; role: string; photo: string };

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  strengths: [Strength, Strength];
  founder: Founder;
  image1: string;
  image2: string;
  image1Alt: string;
  image2Alt: string;
  videoUrl: string;
  watchLabel: string;
  watchSub: string;
};

const SPRING = { type: "spring" as const, stiffness: 300, damping: 22 };

function collageVariant(i: number) {
  return {
    hidden: { opacity: 0, y: 20, x: -16 },
    visible: {
      opacity: 1, y: 0, x: 0,
      transition: { duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.08 },
    },
  };
}

function textVariant(i: number) {
  return {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.06 },
    },
  };
}

export function MarketPositioningSection({
  eyebrow,
  title,
  description,
  strengths,
  founder,
  image1,
  image2,
  image1Alt,
  image2Alt,
  videoUrl,
  watchLabel,
  watchSub,
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const animate = inView ? "visible" : "hidden";

  return (
    <section className="mp-section" ref={ref} aria-labelledby="mp-title">
      <div className="mp-inner">

        {/* ── Colonne gauche : collage ── */}
        <div className="mp-collage" aria-hidden="true">
          <motion.div
            className="mp-photo mp-photo--1"
            variants={reduced ? undefined : collageVariant(0)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : animate}
          >
            <Image src={image1} alt={image1Alt} fill className="object-cover" sizes="(max-width:1023px) 60vw, 28vw" />
          </motion.div>

          <motion.div
            className="mp-photo mp-photo--2"
            variants={reduced ? undefined : collageVariant(1)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : animate}
          >
            <Image src={image2} alt={image2Alt} fill className="object-cover" sizes="(max-width:1023px) 55vw, 25vw" />
          </motion.div>

          {/* Badge doré flottant */}
          <motion.div
            className="mp-badge"
            initial={reduced ? false : { scale: 0 }}
            animate={reduced ? undefined : (inView ? { scale: 1 } : { scale: 0 })}
            transition={reduced ? undefined : { ...SPRING, delay: 0.22 }}
          >
            <Building2 className="mp-badge__icon" aria-hidden />
          </motion.div>

          {/* Bloc vidéo */}
          <motion.div
            variants={reduced ? undefined : collageVariant(2)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : animate}
          >
            <Link href={videoUrl} target="_blank" rel="noopener noreferrer" className="mp-video-block">
              <div className="mp-video-block__play" aria-hidden>
                <Play className="mp-video-block__play-icon" />
              </div>
              <div>
                <span className="mp-video-block__label">{watchLabel}</span>
                <span className="mp-video-block__sub">{watchSub}</span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ── Colonne droite : texte ── */}
        <div className="mp-content">
          <motion.span
            className="mp-eyebrow"
            variants={reduced ? undefined : textVariant(0)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : animate}
          >
            {eyebrow}
          </motion.span>

          <motion.h2
            id="mp-title"
            className="mp-title"
            variants={reduced ? undefined : textVariant(1)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : animate}
          >
            {title}
          </motion.h2>

          <motion.p
            className="mp-description"
            variants={reduced ? undefined : textVariant(2)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : animate}
          >
            {description}
          </motion.p>

          <motion.div
            className="mp-strengths"
            variants={reduced ? undefined : textVariant(3)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : animate}
          >
            {strengths.map((s) => (
              <div key={s.title} className="mp-strength">
                <Check className="mp-strength__check" aria-hidden />
                <h3 className="mp-strength__title">{s.title}</h3>
                <p className="mp-strength__desc">{s.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="mp-founder"
            variants={reduced ? undefined : textVariant(4)}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : animate}
          >
            {founder.photo && (
              <div className="mp-founder__avatar">
                <Image src={founder.photo} alt={founder.name} fill className="object-cover" sizes="48px" />
              </div>
            )}
            <div className="mp-founder__info">
              <span className="mp-founder__name">{founder.name}</span>
              <span className="mp-founder__role">{founder.role}</span>
            </div>
            <div className="mp-founder__signature" aria-hidden>
              <span className="mp-founder__sig-text">{founder.name}</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

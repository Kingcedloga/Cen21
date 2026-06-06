"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { cormorant } from "@/lib/fonts";
import { fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import type { SubsidiaryPhilosophySection } from "@/lib/types";

import "@/styles/wabi-sabi-philosophy.css";

type Props = {
  name: string;
  brandLogo?: string;
  content: SubsidiaryPhilosophySection;
  sectionLabel: string;
};

export function WabiSabiPhilosophySection({
  name,
  brandLogo,
  content,
  sectionLabel,
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const { quote, attribution } = content;

  const motionProps = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-10% 0px -8% 0px", amount: 0.4 },
        variants: fadeUpVariants,
        transition: fadeUpTransition,
      };

  return (
    <section
      className={`wabi-sabi-philosophy ${cormorant.variable}`}
      aria-labelledby="wabi-sabi-philosophy-title"
    >
      <div className="wabi-sabi-philosophy__backdrop" aria-hidden>
        <span className="wabi-sabi-philosophy__texture" />
        <span className="wabi-sabi-philosophy__grain" />
      </div>

      <motion.div className="wabi-sabi-philosophy__inner" {...motionProps}>
        <h2 id="wabi-sabi-philosophy-title" className="sr-only">
          {sectionLabel}
        </h2>

        <div className="wabi-sabi-philosophy__brand">
          {brandLogo ? (
            <Image
              src={brandLogo}
              alt={name}
              width={520}
              height={160}
              className="wabi-sabi-philosophy__logo"
            />
          ) : (
            <p className="wabi-sabi-philosophy__wordmark" aria-hidden>
              {name}
            </p>
          )}
        </div>

        <blockquote className="wabi-sabi-philosophy__quote">
          <p>{quote}</p>
        </blockquote>

        <p className="wabi-sabi-philosophy__signature">{attribution}</p>

        <span className="wabi-sabi-philosophy__divider" aria-hidden />
      </motion.div>
    </section>
  );
}

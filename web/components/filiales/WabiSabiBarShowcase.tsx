"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { cormorant } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import { fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import type { SubsidiaryBarSection } from "@/lib/types";

import "@/styles/wabi-sabi-bar-showcase.css";

type Props = {
  content: SubsidiaryBarSection;
};

export function WabiSabiBarShowcase({ content }: Props) {
  const reduced = useReducedMotion() ?? false;
  const { title, paragraphs, cta, image, imageAlt } = content;

  const motionProps = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-8% 0px -6% 0px", amount: 0.35 },
        variants: fadeUpVariants,
        transition: fadeUpTransition,
      };

  const ctaExternal = cta.href.startsWith("http");

  return (
    <section
      className={`wabi-bar-showcase ${cormorant.variable}`}
      aria-labelledby="wabi-bar-showcase-title"
    >
      <div className="wabi-bar-showcase__media" aria-hidden>
        <Image
          src={image}
          alt=""
          fill
          priority={false}
          placeholder="blur"
          blurDataURL={BLUR_PETROL}
          className="wabi-bar-showcase__image"
          sizes="100vw"
          quality={88}
        />
        <span className="wabi-bar-showcase__overlay" />
      </div>

      <div className="wabi-bar-showcase__inner">
        <motion.div className="wabi-bar-showcase__content" {...motionProps}>
          <h2 id="wabi-bar-showcase-title" className="wabi-bar-showcase__title">
            {title}
          </h2>

          <div className="wabi-bar-showcase__body">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <Button
            href={cta.href}
            variant="secondary"
            size="lg"
            external={ctaExternal}
            className="wabi-bar-showcase__cta"
          >
            {cta.label}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

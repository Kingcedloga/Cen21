"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Link } from "@/i18n/navigation";
import { cormorant } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import { defaultScrollViewport, fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import { PhoneLocationPicker, type PhoneLocation } from "@/components/filiales/PhoneLocationPicker";

import "@/styles/k-lounge-reservation-banner.css";

type Props = {
  backgroundImage: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  locations?: PhoneLocation[];
};

export function KLoungeReservationBanner({
  backgroundImage,
  eyebrow,
  title,
  ctaLabel,
  ctaHref,
  locations,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <section
      className={`klounge-reservation ${cormorant.variable}`}
      aria-labelledby="klounge-reservation-title"
    >
      <div className="klounge-reservation__media" aria-hidden>
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority={false}
          placeholder="blur"
          blurDataURL={BLUR_PETROL}
          className="klounge-reservation__image"
          sizes="100vw"
          quality={85}
        />
        <span className="klounge-reservation__overlay" />
      </div>

      <motion.div
        className="klounge-reservation__content"
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={defaultScrollViewport}
        variants={reduced ? undefined : fadeUpVariants}
        transition={fadeUpTransition}
      >
        <p className="klounge-reservation__eyebrow">{eyebrow}</p>
        <h2 id="klounge-reservation-title" className="klounge-reservation__title">
          {title}
        </h2>
        {locations && locations.length > 0 ? (
          <PhoneLocationPicker
            locations={locations}
            popoverVariant="dark"
            align="center"
            renderTrigger={(onClick) => (
              <button type="button" onClick={onClick} className="klounge-reservation__cta">
                {ctaLabel}
              </button>
            )}
          />
        ) : (
          <Link href={ctaHref} className="klounge-reservation__cta">
            {ctaLabel}
          </Link>
        )}
      </motion.div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Star } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/moka-more-quote-section.css";

type Props = {
  leftImage: string;
  rightImage: string;
};

export function MokaMoreQuoteSection({ leftImage, rightImage }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");

  const lineMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: defaultScrollViewport,
          transition: { duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.1 },
        };

  return (
    <section className="moka-quote">
      <motion.div
        className="moka-quote__photo moka-quote__photo--left"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, x: -40 }}
        whileInView={reduced ? undefined : { opacity: 0.5, x: 0 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.luxe, ease: EASE.luxury }}
      >
        <Image src={leftImage} alt="" fill className="moka-quote__photo-img" sizes="22vw" />
      </motion.div>

      <motion.div
        className="moka-quote__photo moka-quote__photo--right"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, x: 40 }}
        whileInView={reduced ? undefined : { opacity: 0.5, x: 0 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.luxe, ease: EASE.luxury }}
      >
        <Image src={rightImage} alt="" fill className="moka-quote__photo-img" sizes="22vw" />
      </motion.div>

      <div className="moka-quote__content">
        <p className="moka-quote__date-line">
          <span aria-hidden="true">·</span>
          {t("mokaMoreQuote.dateLabel")}
          <Star size={13} weight="fill" className="moka-quote__star" aria-hidden="true" />
          <span aria-hidden="true">·</span>
        </p>

        <motion.svg
          className="moka-quote__ornament"
          viewBox="0 0 300 40"
          fill="none"
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0, scale: 0.8 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={defaultScrollViewport}
          transition={{ duration: DURATION_S.base, ease: EASE.spring, delay: 0.2 }}
        >
          <path d="M28 20c0-9 9-9 9 0s-9 9-9 0" stroke="currentColor" strokeWidth="1.2" />
          <line x1="37" y1="20" x2="120" y2="20" stroke="currentColor" strokeWidth="1" />
          <path
            d="M120 20c6-10 14-10 20 0s14 10 20 0 14-10 20 0"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <line x1="180" y1="20" x2="263" y2="20" stroke="currentColor" strokeWidth="1" />
          <path d="M272 20c0-9-9-9-9 0s9 9 9 0" stroke="currentColor" strokeWidth="1.2" />
        </motion.svg>

        <h2 className="moka-quote__title">
          <motion.span className="moka-quote__line moka-quote__line--strong" {...lineMotion(0)}>
            {t("mokaMoreQuote.line1")}
          </motion.span>
          <motion.span className="moka-quote__line moka-quote__line--soft" {...lineMotion(1)}>
            {t("mokaMoreQuote.line2")}
          </motion.span>
          <motion.span className="moka-quote__line moka-quote__line--strong" {...lineMotion(2)}>
            {t("mokaMoreQuote.line3")}
          </motion.span>
        </h2>
      </div>
    </section>
  );
}

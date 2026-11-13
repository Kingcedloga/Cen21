"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useRef } from "react";

import { FilialeOpenStatus } from "@/components/filiales/blocks/FilialeOpenStatus";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { ExternalLink } from "@/lib/icons";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/moka.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_Y = { y: 0 };
const STILL_SCALE = { scale: 1 };
const STILL_ROTATE = { rotate: 0 };

/** Rayon du texte circulaire du badge (viewBox 200 × 200). */
const RING_RADIUS = 78;

/**
 * La une de Moka & More : le nom en capitales rondes et grasses, comme le
 * logo, l'esperluette en rouge et « Lounge Bar » en écriture manuscrite ;
 * à droite, le lounge dans une arche et le badge « salles privées &
 * banquets » (assiette au centre). Au défilement : l'arche glisse plus
 * lentement que la page, la photo se resserre, le badge tourne sur lui-même
 * (rotation liée au défilement, jamais en boucle). Reduced motion : immobile.
 */
export function MokaHero({
  name,
  tagline,
  hours,
  locale,
  image,
  imageAlt,
  plate,
  mapsUrl,
}: {
  name: string;
  tagline: string;
  hours?: string;
  locale: string;
  image: string;
  imageAlt: string;
  /** Assiette détourée posée au centre du badge. */
  plate: string;
  mapsUrl: string;
}) {
  const t = useTranslations("moka");
  const tFiliale = useTranslations("filiale");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const tContact = useTranslations("contact");
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const ringId = useId();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const archY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const imageScale = useTransform(scrollYProgress, [0, 0.7], [1.14, 1]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const plateRotate = useTransform(scrollYProgress, [0, 1], [0, -70]);

  // « Moka & More » : l'esperluette en rouge, chaque mot sur sa ligne.
  const [before, after] = name.includes("&") ? name.split("&").map((part) => part.trim()) : [name, ""];
  const circumference = 2 * Math.PI * RING_RADIUS;

  return (
    <section ref={ref} aria-labelledby="moka-hero-title" data-surface="dark" className="moka-hero">
      <div className="moka-hero__inner">
        <motion.div className="moka-hero__text" style={reduced ? STILL_Y : { y: titleY }}>
          <nav aria-label={tCommon("breadcrumb")} className="moka-crumbs">
            <ol>
              <li>
                <Link href="/">{tNav("home")}</Link>
              </li>
              <li>
                <Link href="/filiales">{tNav("subsidiaries")}</Link>
              </li>
              <li aria-current="page">{name}</li>
            </ol>
          </nav>

          <p className="moka-eyebrow">{t("heroEyebrow")}</p>
          <h1 id="moka-hero-title" className="moka-hero__title">
            <span className="moka-hero__word">{before}</span>
            {after && (
              <>
                {" "}
                <span className="moka-hero__amp">&amp;</span>{" "}
                <span className="moka-hero__word moka-hero__word--last">{after}</span>
              </>
            )}
          </h1>
          <p aria-hidden="true" className="moka-hero__script moka-script">
            {t("heroScript")}
          </p>

          <p className="moka-hero__lead">{tagline}</p>
          {hours && (
            <div className="moka-hero__status">
              <FilialeOpenStatus hours={hours} locale={locale} />
            </div>
          )}

          <div className="moka-hero__actions">
            <Button href="#reservation" native magnetic>
              {tFiliale("reserve")}
            </Button>
            <Button href="#carte" native variant="secondary">
              {t("heroMenu")}
            </Button>
            <Button href={mapsUrl} external variant="ghost">
              {tCommon("directions")}
              <ExternalLink size={16} aria-hidden="true" />
              <span className="sr-only"> ({tContact("newTab")})</span>
            </Button>
          </div>
        </motion.div>

        <div className="moka-hero__visual">
          <motion.div className="moka-hero__arch" style={reduced ? STILL_Y : { y: archY }}>
            <motion.div className="absolute inset-0" style={reduced ? STILL_SCALE : { scale: imageScale }}>
              <Image
                src={image}
                alt={imageAlt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <a href="#reservation" className="moka-badge" aria-label={t("badge")}>
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              className="moka-badge__ring"
              style={reduced ? STILL_ROTATE : { rotate: ringRotate }}
            >
              <defs>
                <path
                  id={ringId}
                  d={`M 100 100 m -${RING_RADIUS} 0 a ${RING_RADIUS} ${RING_RADIUS} 0 1 1 ${RING_RADIUS * 2} 0 a ${RING_RADIUS} ${RING_RADIUS} 0 1 1 -${RING_RADIUS * 2} 0`}
                />
              </defs>
              <text className="moka-badge__text">
                <textPath href={`#${ringId}`} textLength={Math.floor(circumference) - 6} lengthAdjust="spacing">
                  {`${t("badge")} • `}
                </textPath>
              </text>
            </motion.svg>
            <motion.span className="moka-badge__plate" style={reduced ? STILL_ROTATE : { rotate: plateRotate }}>
              <Image src={plate} alt="" fill sizes="120px" className="object-contain" />
            </motion.span>
          </a>
        </div>
      </div>
    </section>
  );
}

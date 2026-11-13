"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { FilialeMark } from "@/components/filiales/blocks/FilialeMark";
import { FilialeOpenStatus } from "@/components/filiales/blocks/FilialeOpenStatus";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { Phone } from "@/lib/icons";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import { MuzikStrings } from "./MuzikStrings";

import "@/styles/muzik.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_MARK = { y: 0, rotate: -6 };

/**
 * La scène de Café Muzik : le nom en capitales d'affiche de concert, la
 * guitare du logo en grand sous un projecteur rouge, et les six cordes
 * tendues sur toute la largeur (elles vibrent avec le défilement et se
 * pincent à la souris). Au défilement, la guitare remonte et se redresse.
 * Reduced motion : immobile.
 */
export function MuzikHero({
  name,
  tagline,
  hours,
  phone,
  locale,
  logo,
  logoRatio,
}: {
  name: string;
  tagline: string;
  hours?: string;
  phone?: string;
  locale: string;
  logo?: string;
  logoRatio: number;
}) {
  const t = useTranslations("muzik");
  const tFiliale = useTranslations("filiale");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const markY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [-6, 4]);

  return (
    <section ref={ref} aria-labelledby="muzik-hero-title" data-surface="dark" className="muzik-hero">
      <div className="muzik-hero__inner">
        <div className="muzik-hero__text">
          <nav aria-label={tCommon("breadcrumb")} className="muzik-crumbs">
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

          <p className="muzik-eyebrow">{t("heroEyebrow")}</p>
          <h1 id="muzik-hero-title" className="muzik-hero__title">
            {name}
          </h1>
          <p className="muzik-hero__lead">{tagline}</p>
          {hours && (
            <div className="muzik-hero__status">
              <FilialeOpenStatus hours={hours} locale={locale} />
            </div>
          )}

          <div className="muzik-hero__actions">
            <Button href="#reservation" native magnetic>
              {tFiliale("reserve")}
            </Button>
            <Button href="#carte" native variant="secondary">
              {t("heroMenu")}
            </Button>
            {phone && (
              <Button href={`tel:${phone.replace(/\s/g, "")}`} native variant="ghost">
                <Phone size={16} aria-hidden="true" />
                {tCommon("call")}
              </Button>
            )}
          </div>
        </div>

        {logo && (
          <motion.div className="muzik-hero__mark" style={reduced ? STILL_MARK : { y: markY, rotate: markRotate }}>
            <FilialeMark src={logo} ratio={logoRatio} width="100%" />
          </motion.div>
        )}
      </div>

      <MuzikStrings className="muzik-hero__strings" />
    </section>
  );
}

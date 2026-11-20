"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { FilialeHeroLogo, type HeroLogo } from "@/components/filiales/blocks/FilialeHeroLogo";
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
 * La scène de Café Muzik : le nom en capitales d'affiche de concert (ou le
 * logo de la maison en titre, `titleLogo`), la
 * guitare du logo en grand sous un projecteur rouge, et les six cordes
 * tendues sur toute la largeur (elles vibrent avec le défilement et se
 * pincent à la souris). Au défilement, la guitare remonte et se redresse.
 * Avec `photo` : scène de nuit — fond noir (l'encre de la maison), la photo
 * de la maison en grand qui se fond dans le noir, le projecteur rouge en
 * halo de scène, texte et cordes en blanc (sans la guitare du logo) ; la
 * photo s'approche à peine au défilement. Reduced motion : immobile.
 */
export function MuzikHero({
  name,
  tagline,
  hours,
  phone,
  locale,
  logo,
  logoRatio,
  photo,
  titleLogo,
}: {
  name: string;
  tagline: string;
  hours?: string;
  phone?: string;
  locale: string;
  logo?: string;
  logoRatio: number;
  /** Photo de fond (scène de nuit). Sans photo : la scène blanche de la charte. */
  photo?: string;
  /** Logo de la maison en titre (le nom reste lu par les lecteurs d'écran). */
  titleLogo?: HeroLogo;
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
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      aria-labelledby="muzik-hero-title"
      // Scène de nuit : fond noir, d'où « light » (la capsule de navigation
      // passe en blanc ; « dark » désigne le fond blanc de la charte).
      data-surface={photo ? "light" : "dark"}
      className={`muzik-hero ${photo ? "muzik-hero--night" : ""}`}
    >
      {photo && (
        <motion.div aria-hidden="true" className="muzik-hero__photo" style={reduced ? undefined : { scale: photoScale }}>
          <Image src={photo} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        </motion.div>
      )}
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
          {titleLogo ? (
            <FilialeHeroLogo id="muzik-hero-title" name={name} logo={titleLogo} className="muzik-hero__title-logo" />
          ) : (
            <h1 id="muzik-hero-title" className="muzik-hero__title">
              {name}
            </h1>
          )}
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

        {/* Scène de nuit : la photo porte l'ambiance, pas de guitare par-dessus. */}
        {logo && !photo && (
          <motion.div className="muzik-hero__mark" style={reduced ? STILL_MARK : { y: markY, rotate: markRotate }}>
            <FilialeMark src={logo} ratio={logoRatio} width="100%" />
          </motion.div>
        )}
      </div>

      <MuzikStrings className="muzik-hero__strings" />
    </section>
  );
}

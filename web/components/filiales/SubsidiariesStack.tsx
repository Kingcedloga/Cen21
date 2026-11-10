"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";

import { RollingText } from "@/components/motion/RollingText";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/lib/icons";
import { MOBILE_QUERY } from "@/lib/motion";
import type { BrandCardPalette } from "@/lib/subsidiary-brand";
import { useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/subsidiaries-stack.css";

export type StackItem = {
  slug: string;
  name: string;
  sector: string;
  tagline: string;
  hours?: string;
  address?: string;
  image: string;
  /** Logo blanc, posé sur `logoSurface` (couleur de marque assez sombre). */
  logo?: string;
  logoSurface: string;
  href: string;
  external: boolean;
  ctaLabel: string;
  palette: BrandCardPalette;
};

type StackLabels = { list: string; hours: string; address: string; newTab: string };

/** Recul de la carte sortante (Orbix : scale → .75, rotateX 15°, rotateY ±8°, y +6 à 8 %), adouci. */
const RECEDE = { scale: 0.12, y: 5, rotateX: 9, rotateY: 5, shade: 0.55 } as const;

function CardLink({
  item,
  newTab,
  children,
}: {
  item: StackItem;
  newTab: string;
  children: ReactNode;
}) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="stack-card__cta tap-press">
        {children}
        <span className="sr-only"> ({newTab})</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className="stack-card__cta tap-press">
      {children}
    </Link>
  );
}

function StackCard({
  item,
  index,
  count,
  progress,
  animated,
  tilt,
  labels,
}: {
  item: StackItem;
  index: number;
  count: number;
  progress: MotionValue<number>;
  animated: boolean;
  tilt: boolean;
  labels: StackLabels;
}) {
  // La carte i est recouverte pendant que la carte i + 1 monte : de i à i + 1
  // écrans de défilement, soit p × (n − 1) − i sur la progression de la liste.
  const recede = useTransform(progress, (v) =>
    index >= count - 1 ? 0 : Math.min(1, Math.max(0, v * (count - 1) - index)),
  );
  const scale = useTransform(recede, (r) => 1 - RECEDE.scale * r);
  const y = useTransform(recede, (r) => `${RECEDE.y * r}%`);
  const rotateX = useTransform(recede, (r) => RECEDE.rotateX * r);
  const rotateY = useTransform(recede, (r) => (index % 2 === 0 ? RECEDE.rotateY : -RECEDE.rotateY) * r);
  const shade = useTransform(recede, (r) => RECEDE.shade * r);

  const { palette } = item;
  const vars = {
    "--stack-bg": palette.background,
    "--stack-title": palette.title,
    "--stack-body": palette.body,
    "--stack-muted": palette.muted,
    "--stack-accent": palette.accent,
  } as CSSProperties;

  return (
    <li className="stack-card" data-surface={palette.surface} style={vars}>
      <motion.article
        aria-labelledby={`stack-${item.slug}`}
        className="stack-card__panel"
        // Mobile : pas d'inclinaison 3D (brief), seulement le recul et l'ombre.
        style={animated ? { scale, y, ...(tilt ? { rotateX, rotateY } : {}) } : undefined}
      >
        <header className="stack-card__head">
          <span aria-hidden="true" className="stack-card__number">
            /{String(index + 1).padStart(2, "0")}
          </span>
          <span className="stack-card__sector">{item.sector}</span>
        </header>

        <div className="stack-card__body">
          <div className="stack-card__text">
            {item.logo && (
              <span className="stack-card__logo" style={{ backgroundColor: item.logoSurface }}>
                <Image src={item.logo} alt="" fill sizes="64px" className="object-contain p-2" />
              </span>
            )}
            <h3 id={`stack-${item.slug}`} className="title-section stack-card__name text-balance">
              {item.name}
            </h3>
            <p className="stack-card__tagline">{item.tagline}</p>
            {(item.hours || item.address) && (
              <dl className="stack-card__facts">
                {item.hours && (
                  <div>
                    <dt>{labels.hours}</dt>
                    <dd>{item.hours}</dd>
                  </div>
                )}
                {item.address && (
                  <div>
                    <dt>{labels.address}</dt>
                    <dd>{item.address}</dd>
                  </div>
                )}
              </dl>
            )}
            <CardLink item={item} newTab={labels.newTab}>
              <RollingText text={item.ctaLabel} />
              <ArrowUpRight size={16} aria-hidden="true" />
            </CardLink>
          </div>

          {/* Panneau bas à grand arrondi (Orbix : feuille r70, blanc 20 % → transparent). */}
          <div className="stack-card__sheet">
            <div className="stack-card__media">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </div>
        </div>

        <motion.span aria-hidden="true" className="stack-card__shade" style={animated ? { opacity: shade } : undefined} />
      </motion.article>
    </li>
  );
}

/**
 * Les dix filiales en cartes plein écran empilées, chacune à sa charte
 * (Orbix : « services » empilés, /01 à /06). Chaque carte reste collée en haut
 * pendant que la suivante monte par-dessus ; la carte recouverte recule en 3D
 * et s'assombrit. Mobile : sans inclinaison. Reduced motion : liste de cartes.
 */
export function SubsidiariesStack({ items, labels }: { items: StackItem[]; labels: StackLabels }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] });
  const reduced = useReducedMotionSafe();
  const mobile = useMediaQuery(MOBILE_QUERY);

  return (
    <ol ref={listRef} aria-label={labels.list} className="subsidiaries-stack">
      {items.map((item, index) => (
        <StackCard
          key={item.slug}
          item={item}
          index={index}
          count={items.length}
          progress={scrollYProgress}
          animated={!reduced}
          tilt={!mobile}
          labels={labels}
        />
      ))}
    </ol>
  );
}

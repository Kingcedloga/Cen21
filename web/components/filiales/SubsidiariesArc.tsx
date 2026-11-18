"use client";

import Image from "next/image";

import { ArcSlider } from "@/components/motion/ArcSlider";
import { Link } from "@/i18n/navigation";

import "@/styles/subsidiaries-arc.css";

export type ArcItem = {
  slug: string;
  name: string;
  sector: string;
  tagline: string;
  cover: string;
  logo?: string;
  /** « Découvrir {name} » */
  ariaLabel: string;
  /** « {index} sur {total} : {name} » — annoncé au changement de carte. */
  positionLabel: string;
};

export type ArcLabels = {
  region: string;
  roledescription: string;
  prev: string;
  next: string;
  drag: string;
  discover: string;
};

/**
 * Filiales en éventail (accueil « Nos filiales », « Nos autres maisons » des
 * fiches) : une carte par filiale, identique partout — photo, voile noir
 * léger en tête sous le logo et le texte, bouton « Découvrir » en pied.
 * Toute la carte centrale est cliquable : un lien couvre la carte (doublon du
 * bouton, retiré du clavier et des lecteurs d'écran). Glisser ne l'ouvre pas,
 * cliquer une voisine la ramène au centre (ArcSlider).
 * Mécanique : components/motion/ArcSlider.tsx.
 */
export function SubsidiariesArc({ items, labels }: { items: ArcItem[]; labels: ArcLabels }) {
  return (
    <ArcSlider
      items={items}
      getKey={(item) => item.slug}
      getPositionLabel={(item) => item.positionLabel}
      labels={labels}
      renderCard={(item, { active }) => (
        <>
          <Image
            src={item.cover}
            alt=""
            fill
            draggable={false}
            sizes="(max-width: 768px) 76vw, 440px"
            className="object-cover"
          />
          <div aria-hidden="true" className="arc-card__shade absolute inset-0" />

          {/* Toute la carte ouvre la fiche (le bouton reste le lien accessible). */}
          <Link
            href={`/filiales/${item.slug}`}
            aria-hidden="true"
            tabIndex={-1}
            draggable={false}
            className="absolute inset-0 z-[1]"
          />

          <div className="arc-card__head pointer-events-none relative flex flex-col items-center gap-3 px-6 pt-7 text-center md:px-8 md:pt-9">
            {item.logo && (
              <span className="relative block h-14 w-36 md:h-16 md:w-44">
                <Image src={item.logo} alt="" fill draggable={false} sizes="176px" className="object-contain" />
              </span>
            )}
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose">{item.sector}</p>
            <h3 className="title-section text-2xl text-ivory md:text-[1.75rem]">{item.name}</h3>
            <p className="line-clamp-2 max-w-[22rem] text-sm text-ivory/80">{item.tagline}</p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex h-[4.5rem] items-center justify-center">
            <Link
              href={`/filiales/${item.slug}`}
              aria-label={item.ariaLabel}
              tabIndex={active ? 0 : -1}
              draggable={false}
              className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-ivory px-5 text-sm font-medium text-petrol-panel-4 shadow-[var(--shadow-soft)] transition-transform duration-fine hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
            >
              {labels.discover}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </>
      )}
    />
  );
}

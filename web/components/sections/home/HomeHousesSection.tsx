"use client";

import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { Link } from "@/i18n/navigation";

import "@/styles/home-houses.css";

export type HouseItem = {
  slug: string;
  name: string;
  logo: string;
  /** Couleur de fond du verso (charte de la marque, lisible sous le logo blanc). */
  brandColor: string;
  /** « Découvrir {name} » */
  ariaLabel: string;
};

/**
 * « Nos maisons » : les 10 filiales en grille 5 × 2 (Orbix : grille de logos
 * clients). Recto logo blanc sur pétrole, verso aux couleurs de la marque.
 * Sur l'accueil, la section sert de rideau qui monte sur le hero (desktop).
 */
export function HomeHousesSection({
  eyebrow,
  title,
  titleSweep,
  items,
  titleId = "home-houses-title",
  className = "",
}: {
  eyebrow: string;
  title: string;
  titleSweep?: string;
  items: HouseItem[];
  titleId?: string;
  className?: string;
}) {
  const gridRef = useRef<HTMLUListElement>(null);
  const waved = useInView(gridRef, { once: true, amount: 0.4 });

  return (
    <section
      data-surface="dark"
      aria-labelledby={titleId}
      className={`px-4 pb-24 pt-24 md:px-8 md:pb-32 md:pt-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <SpectrumText
          as="h2"
          id={titleId}
          mode="scroll"
          text={title}
          sweep={titleSweep}
          className="title-section mt-4 max-w-3xl text-h2 text-ivory text-balance"
        />

        <ul ref={gridRef} data-wave={waved ? "" : undefined} className="houses-grid mt-12 grid grid-cols-2 gap-2 sm:grid-cols-5 md:mt-16 md:gap-3">
          {items.map((item, index) => (
            <li key={item.slug} style={{ "--i": index } as CSSProperties}>
              <Link
                href={`/filiales/${item.slug}`}
                aria-label={item.ariaLabel}
                className="house-card tap-press cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <span className="house-card__inner">
                  <span className="house-card__face border border-ivory/10 bg-petrol-panel-3/70">
                    <Image
                      src={item.logo}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, 20vw"
                      className="object-contain p-[18%] opacity-90"
                    />
                  </span>
                  <span className="house-card__face house-card__face--back" style={{ backgroundColor: item.brandColor }}>
                    <Image
                      src={item.logo}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, 20vw"
                      className="object-contain px-[18%] pt-[12%] pb-[26%]"
                    />
                    <span className="absolute inset-x-2 bottom-2 truncate rounded-full bg-petrol-panel-4/75 px-3 py-1 text-center text-[11px] font-medium text-ivory backdrop-blur-sm">
                      {item.name}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

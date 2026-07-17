"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useMemo, type CSSProperties } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { SubsidiaryHrefLink } from "@/components/navigation/SubsidiaryHrefLink";
import { cormorant } from "@/lib/fonts";
import type { SubsidiaryLinkTarget } from "@/lib/subsidiary-links";

import "@/styles/wabi-sabi-beige-band.css";
import "@/styles/wabi-sabi-establishments.css";
import "@/styles/k-lounge-establishments.css";
import "@/styles/millionaire-club-establishments.css";
import "@/styles/pinkberry-establishments.css";
import "@/styles/olive-verte-establishments.css";
import "@/styles/muzik-cafe-establishments.css";
import "@/styles/moka-more-establishments.css";

export type SisterSubsidiary = SubsidiaryLinkTarget & {
  name: string;
  brandLogo: string;
};

type Props = {
  subsidiaries: SisterSubsidiary[];
  title: string;
  description: string;
  variant?:
    | "wabi-sabi"
    | "k-lounge"
    | "millionaire-club"
    | "pinkberry"
    | "olive-verte"
    | "muzik-cafe"
    | "moka-more";
  decorativeSlot?: React.ReactNode;
};

function EstablishmentLogo({ subsidiary }: { subsidiary: SisterSubsidiary }) {
  return (
    <div className="wabi-establishments__item">
      <SubsidiaryHrefLink
        subsidiary={subsidiary}
        className="wabi-establishments__link"
        aria-label={subsidiary.name}
      >
        <span className="wabi-establishments__logo-wrap">
          <Image
            src={subsidiary.brandLogo}
            alt=""
            width={280}
            height={96}
            className="wabi-establishments__logo"
            sizes="(max-width: 767px) 36vw, 160px"
          />
        </span>
        <span className="wabi-establishments__name">{subsidiary.name}</span>
      </SubsidiaryHrefLink>
    </div>
  );
}

export function WabiSabiEstablishmentsSection({
  subsidiaries,
  title,
  description,
  variant = "wabi-sabi",
  decorativeSlot,
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const list = subsidiaries.filter((s) => s.brandLogo);

  const durationSeconds = useMemo(
    () => Math.max(list.length * 5.5, 42),
    [list.length],
  );

  if (list.length === 0) return null;

  const loop = [...list, ...list];

  const sectionId =
    variant === "k-lounge"
      ? "klounge-establishments-title"
      : variant === "millionaire-club"
        ? "millionaire-establishments-title"
        : variant === "pinkberry"
          ? "pinkberry-establishments-title"
          : variant === "olive-verte"
            ? "olive-verte-establishments-title"
            : variant === "muzik-cafe"
              ? "muzik-cafe-establishments-title"
              : variant === "moka-more"
                ? "moka-more-establishments-title"
                : "wabi-establishments-title";

  const variantClass =
    variant === "k-lounge"
      ? "wabi-establishments--k-lounge"
      : variant === "millionaire-club"
        ? "wabi-establishments--millionaire-club"
        : variant === "pinkberry"
          ? "wabi-establishments--pinkberry"
          : variant === "olive-verte"
            ? "wabi-establishments--olive-verte"
            : variant === "muzik-cafe"
              ? "wabi-establishments--muzik-cafe"
              : variant === "moka-more"
                ? "wabi-establishments--moka-more"
                : "wabi-sabi-beige-band";

  return (
    <section
      className={["wabi-establishments", variantClass, cormorant.variable]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={sectionId}
      style={{ "--wabi-establishments-duration": `${durationSeconds}s` } as CSSProperties}
    >
      {decorativeSlot}
      <div className="wabi-establishments__inner">
        <AnimateIn className="wabi-establishments__header">
          <h2 id={sectionId} className="wabi-establishments__title">
            {title}
          </h2>
          <p className="wabi-establishments__description">{description}</p>
        </AnimateIn>
      </div>

      <div
        className={`wabi-establishments__viewport${reduced ? " wabi-establishments__viewport--static" : ""}`}
        aria-label={title}
      >
        <div
          className={`wabi-establishments__track${reduced ? " wabi-establishments__track--static" : ""}`}
        >
          {loop.map((subsidiary, index) => (
            <EstablishmentLogo
              key={`${subsidiary.slug}-${index}`}
              subsidiary={subsidiary}
            />
          ))}
        </div>
        <span className="wabi-establishments__fade wabi-establishments__fade--left" aria-hidden />
        <span className="wabi-establishments__fade wabi-establishments__fade--right" aria-hidden />
      </div>
    </section>
  );
}

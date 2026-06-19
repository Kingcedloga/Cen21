"use client";

import Image from "next/image";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { cormorant } from "@/lib/fonts";
import type { SocialLinks as SocialLinksData } from "@/lib/types";

import "@/styles/millionaire-club-intro-section.css";

type Props = {
  name: string;
  brandLogo?: string;
  tagline: string;
  social: SocialLinksData;
  accentColor?: string;
};

export function MillionaireClubIntroSection({
  name,
  brandLogo,
  tagline,
  social,
  accentColor = "#C9A84C",
}: Props) {
  return (
    <section
      className={`millionaire-intro ${cormorant.variable}`}
      aria-labelledby="millionaire-intro-title"
    >
      <div className="millionaire-intro__inner">
        <AnimateIn className="millionaire-intro__content">
          {brandLogo ? (
            <div className="millionaire-intro__logo-wrap">
              <Image
                src={brandLogo}
                alt={name}
                width={280}
                height={80}
                className="millionaire-intro__logo"
                priority
                sizes="(max-width: 767px) 52vw, 200px"
                style={{
                  filter: `drop-shadow(0 4px 28px ${accentColor}44)`,
                }}
              />
            </div>
          ) : (
            <h2 id="millionaire-intro-title" className="millionaire-intro__name">
              {name}
            </h2>
          )}

          {brandLogo && (
            <h2 id="millionaire-intro-title" className="sr-only">
              {name}
            </h2>
          )}

          <SocialLinks
            social={social}
            className="millionaire-intro__social"
          />

          <p className="millionaire-intro__tagline">{tagline}</p>
        </AnimateIn>
      </div>
    </section>
  );
}

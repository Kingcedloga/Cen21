"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useMemo, type CSSProperties } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Link } from "@/i18n/navigation";
import { cormorant } from "@/lib/fonts";

import "@/styles/wabi-sabi-establishments.css";

export type SisterSubsidiary = {
  slug: string;
  name: string;
  brandLogo: string;
};

type Props = {
  subsidiaries: SisterSubsidiary[];
  title: string;
  description: string;
};

function EstablishmentLogo({ subsidiary }: { subsidiary: SisterSubsidiary }) {
  return (
    <div className="wabi-establishments__item">
      <Link
        href={`/filiales/${subsidiary.slug}`}
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
      </Link>
    </div>
  );
}

export function WabiSabiEstablishmentsSection({
  subsidiaries,
  title,
  description,
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const list = subsidiaries.filter((s) => s.brandLogo);

  const durationSeconds = useMemo(
    () => Math.max(list.length * 5.5, 42),
    [list.length],
  );

  if (list.length === 0) return null;

  const loop = [...list, ...list];

  return (
    <section
      className={`wabi-establishments ${cormorant.variable}`}
      aria-labelledby="wabi-establishments-title"
      style={{ "--wabi-establishments-duration": `${durationSeconds}s` } as CSSProperties}
    >
      <div className="wabi-establishments__inner">
        <AnimateIn className="wabi-establishments__header">
          <h2 id="wabi-establishments-title" className="wabi-establishments__title">
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

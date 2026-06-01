"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

import { Icon } from "@/components/ui/Icon";

type Props = {
  backgroundImage: string;
  hoursLabel: string;
  findUsLabel: string;
  callUsLabel: string;
  ctaLabel: string;
  hours?: string;
  address?: string;
  phone?: string;
  mapsUrl?: string;
  themed?: boolean;
};

export function SubsidiaryContactBand({
  backgroundImage,
  hoursLabel,
  findUsLabel,
  callUsLabel,
  ctaLabel,
  hours,
  address,
  phone,
  mapsUrl,
  themed = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-22%", "22%"],
  );

  const bgTransform = useTransform(bgY, (y) => `translateY(${y}) scale(1.24)`);

  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined;

  return (
    <section
      ref={sectionRef}
      className="sub-contact-band relative isolate min-h-[70vh]"
      aria-label={`${hoursLabel} · ${findUsLabel} · ${callUsLabel}`}
    >
      {/* Fond photo — sticky prolongé + parallax accentué */}
      <div className="sub-contact-band__media sticky top-0 h-[40vh] max-h-[40vh] w-full overflow-hidden">
        <motion.div
          className="sub-contact-band__photo absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            transform: bgTransform,
          }}
          aria-hidden
        />
        <div
          className={`sub-contact-band__overlay absolute inset-0 ${
            themed ? "sub-contact-band__overlay--themed" : "sub-contact-band__overlay--default"
          }`}
          aria-hidden
        />
      </div>

      {/* Contenu centré — colonnes + CTA groupés */}
      <div className="sub-contact-band__content relative z-10 -mt-[40vh] flex h-[40vh] max-h-[40vh] flex-col items-center justify-center gap-6 px-5 py-4 text-center md:gap-7 md:px-8">
        <div className="sub-contact-band__body pointer-events-auto mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 md:gap-8">
          {hours && (
            <ContactColumn icon="hours" label={hoursLabel} themed={themed}>
              {hours}
            </ContactColumn>
          )}

            {address && (
              <ContactColumn
                icon="location"
                label={findUsLabel}
                themed={themed}
                href={mapsUrl}
              >
                {address}
              </ContactColumn>
            )}

            {phone && phoneHref && (
              <ContactColumn
                icon="phone"
                label={callUsLabel}
                themed={themed}
                href={phoneHref}
              >
                {phone}
              </ContactColumn>
            )}
        </div>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`sub-contact-band__cta relative z-20 inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full border px-10 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-[transform,background-color,border-color,color] duration-fine ease-out active:scale-[0.97] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 ${
              themed
                ? "border-[color:var(--sub-text)]/35 bg-black/35 text-[var(--sub-text)] backdrop-blur-md hover:border-[color:var(--sub-gold)]/55 hover:bg-black/45 hover:text-[var(--sub-gold)] focus-visible:outline-[color:var(--sub-gold)]"
                : "border-white/30 bg-black/35 text-ivory backdrop-blur-md hover:border-gold/50 hover:bg-black/45 hover:text-gold focus-visible:outline-gold"
            }`}
          >
            {ctaLabel}
          </a>
        )}
      </div>

      {/* Piste de scroll — prolonge l'ancrage sticky au-delà du bandeau visible */}
      <div className="sub-contact-band__scroll-runway h-[30vh]" aria-hidden />
    </section>
  );
}

function ContactColumn({
  icon,
  label,
  children,
  themed,
  href,
}: {
  icon: "hours" | "location" | "phone";
  label: string;
  children: ReactNode;
  themed?: boolean;
  href?: string;
}) {
  const iconClass = themed ? "text-[var(--sub-text)]" : "text-ivory";
  const labelClass = themed ? "text-[var(--sub-text)]" : "text-ivory";
  const valueClass = themed
    ? "text-[var(--sub-text-muted)] group-hover:text-[var(--sub-gold)]"
    : "text-ivory/70 group-hover:text-gold";

  const inner = (
    <>
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm transition-colors duration-fine group-hover:border-white/25">
        <Icon name={icon} size="xl" className={iconClass} strokeWidth={1.25} />
      </span>
      <p className={`mb-2 text-sm font-medium tracking-wide ${labelClass}`}>
        {label}
      </p>
      <p
        className={`text-xs leading-relaxed transition-colors duration-fine md:text-sm ${valueClass}`}
      >
        {children}
      </p>
    </>
  );

  const className =
    "group flex flex-col items-center text-center cursor-pointer";

  if (href) {
    return (
      <a
        href={href}
        className={className}
        rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"}
        target={href.startsWith("tel:") ? undefined : "_blank"}
      >
        {inner}
      </a>
    );
  }

  return <div className="flex flex-col items-center text-center">{inner}</div>;
}

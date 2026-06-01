"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef, useState, type ReactNode } from "react";

import { Icon } from "@/components/ui/Icon";
import { EASE, fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import { buildHoursSchedule } from "@/lib/subsidiary-hours";

const HOURS_STAGGER_S = 0.06;

type Props = {
  backgroundImage: string;
  hoursLabel: string;
  findUsLabel: string;
  callUsLabel: string;
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
      className="sub-contact-band relative isolate hidden min-h-[70vh] lg:block"
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

      {/* Contenu centré — colonnes */}
      <div className="sub-contact-band__content relative z-10 -mt-[40vh] flex h-[40vh] max-h-[40vh] flex-col items-center justify-center px-5 py-4 text-center md:px-8">
        <div className="sub-contact-band__body pointer-events-auto mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 md:gap-8">
          {hours && (
            <HoursRevealColumn
              hours={hours}
              label={hoursLabel}
              themed={themed}
            />
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

function HoursRevealColumn({
  hours,
  label,
  themed,
}: {
  hours: string;
  label: string;
  themed?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("subsidiaries.contactBand");
  const reduced = useReducedMotion() ?? false;
  const [expanded, setExpanded] = useState(false);

  const { preview, schedule } = useMemo(
    () => buildHoursSchedule(hours, locale),
    [hours, locale],
  );

  const iconClass = themed ? "text-[var(--sub-text)]" : "text-ivory";
  const labelClass = themed ? "text-[var(--sub-text)]" : "text-ivory";
  const valueClass = themed
    ? "text-[var(--sub-text-muted)] group-hover:text-[var(--sub-gold)]"
    : "text-ivory/70 group-hover:text-gold";
  const closedClass = themed
    ? "text-[var(--sub-text-subtle)]"
    : "text-ivory/45";

  return (
    <div
      className="group flex w-full flex-col items-center text-center"
      aria-expanded={expanded}
      aria-label={`${label} — ${preview}`}
    >
      <span
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="mx-auto mb-4 flex h-14 w-14 cursor-default items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm transition-colors duration-fine group-hover:border-white/25"
      >
        <Icon name="hours" size="xl" className={iconClass} strokeWidth={1.25} />
      </span>
      <p className={`mb-2 text-sm font-medium tracking-wide ${labelClass}`}>
        {label}
      </p>

      {!expanded ? (
        <p
          className={`text-xs leading-relaxed transition-colors duration-fine md:text-sm ${valueClass}`}
        >
          {preview}
        </p>
      ) : (
        <span key="hours-full" className="flex w-full flex-col gap-1.5">
          {schedule.map((day, index) => (
            <motion.span
              key={day.index}
              className={`block text-xs leading-relaxed md:text-sm ${
                day.closed ? closedClass : valueClass
              }`}
              initial={reduced ? false : "hidden"}
              animate={reduced ? undefined : "visible"}
              variants={reduced ? undefined : fadeUpVariants}
              transition={{
                ...fadeUpTransition,
                delay: reduced ? 0 : index * HOURS_STAGGER_S,
                ease: EASE.luxury,
              }}
            >
              {day.label} · {day.closed ? t("closed") : day.range}
            </motion.span>
          ))}
        </span>
      )}
    </div>
  );
}

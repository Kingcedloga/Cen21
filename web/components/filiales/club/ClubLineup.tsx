"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { Button } from "@/components/ui/Button";
import { DURATION_S, EASE } from "@/lib/motion";
import { ArrowUpRight } from "@/lib/icons";
import { FINE_POINTER_QUERY, useHydrated, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/club.css";

export type LineupNight = {
  id: string;
  title: string;
  /** Date de la soirée à Kinshasa, AAAA-MM-JJ (pour « Ce soir »). */
  day: string;
  weekday: string;
  dayNumber: string;
  month: string;
  time: string;
  excerpt: string;
  image: string;
};

/** Date du jour à Kinshasa, AAAA-MM-JJ. */
function kinshasaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Kinshasa" }).format(new Date());
}

/**
 * Le line-up du club comme une affiche de festival : les soirées à thème en
 * très grandes capitales. Souris : l'affiche de la soirée survolée suit le
 * pointeur, les autres lignes s'éteignent. Écran tactile : la ligne au milieu
 * de l'écran s'allume et déplie son affiche. « Ce soir » après hydratation.
 * Reduced motion : affiches fixes, sans suivi ni dépliage animé.
 */
export function ClubLineup({ nights, agendaHref }: { nights: LineupNight[]; agendaHref: string }) {
  const t = useTranslations("club");
  const reduced = useReducedMotionSafe();
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const hydrated = useHydrated();
  const today = hydrated ? kinshasaToday() : "";
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // Affiche qui suit la souris (ressort), relative à la liste.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28 });
  const springY = useSpring(y, { stiffness: 260, damping: 28 });
  const follow = finePointer && !reduced;

  const onMove = (event: PointerEvent<HTMLOListElement>) => {
    if (!follow || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <div className="club-lineup">
      <header className="club-lineup__head">
        <p className="club-eyebrow">{t("lineupEyebrow")}</p>
        <h2 id="club-lineup-title" className="club-lineup__title">
          {t("lineupTitle")}
        </h2>
        <Button href={agendaHref} variant="secondary">
          {t("lineupAll")}
        </Button>
      </header>

      {nights.length === 0 ? (
        <p className="club-lineup__empty">{t("lineupEmpty")}</p>
      ) : (
        <ol
          ref={listRef}
          className={`club-lineup__list ${active !== null ? "has-active" : ""}`}
          onPointerMove={onMove}
          onPointerLeave={() => finePointer && setActive(null)}
        >
          {nights.map((night, index) => (
            <LineupRow
              key={night.id}
              night={night}
              tonight={night.day === today}
              active={active === index}
              finePointer={finePointer}
              reduced={reduced}
              onEnter={() => finePointer && setActive(index)}
              onCentered={() => !finePointer && setActive(index)}
            />
          ))}

          {follow && (
            <motion.li aria-hidden="true" className="club-lineup__cursor" style={{ x: springX, y: springY }}>
              <AnimatePresence>
                {active !== null && (
                  <motion.div
                    key={nights[active].id}
                    className="club-lineup__poster"
                    initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                    animate={{ opacity: 1, scale: 1, rotate: -3 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 0 }}
                    transition={{ duration: DURATION_S.fine, ease: EASE.outSoft }}
                  >
                    <Image src={nights[active].image} alt="" fill sizes="18rem" className="object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          )}
        </ol>
      )}
    </div>
  );
}

function LineupRow({
  night,
  tonight,
  active,
  finePointer,
  reduced,
  onEnter,
  onCentered,
}: {
  night: LineupNight;
  tonight: boolean;
  active: boolean;
  finePointer: boolean;
  reduced: boolean;
  onEnter: () => void;
  onCentered: () => void;
}) {
  const t = useTranslations("club");
  const ref = useRef<HTMLLIElement>(null);
  // Tactile : la ligne qui traverse le milieu de l'écran est la ligne active.
  const centered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (centered) onCentered();
  }, [centered, onCentered]);

  const open = !finePointer && (active || reduced);

  return (
    <li ref={ref} className={`club-lineup__row ${active ? "is-active" : ""}`} onPointerEnter={onEnter}>
      <a href="#reservation" className="club-lineup__link" aria-label={t("lineupBook", { title: night.title })}>
        <span className="club-lineup__date">
          <span className="club-lineup__weekday">{night.weekday}</span>
          <span className="club-lineup__daynum">{night.dayNumber}</span>
          <span className="club-lineup__month">{night.month}</span>
        </span>
        <span className="club-lineup__body">
          <span className="club-lineup__name">
            {night.title}
            {tonight && <span className="club-lineup__tonight">{t("lineupTonight")}</span>}
          </span>
          <span className="club-lineup__meta">
            {night.time} · {night.excerpt}
          </span>
        </span>
        <ArrowUpRight aria-hidden="true" className="club-lineup__arrow" />
      </a>

      {/* Tactile : l'affiche se déplie sous la ligne active. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="poster"
            aria-hidden="true"
            className="club-lineup__inline"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : DURATION_S.base, ease: EASE.luxury }}
          >
            <div className="club-lineup__inline-img">
              <Image src={night.image} alt="" fill sizes="92vw" className="object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

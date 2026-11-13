"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { DURATION_S, EASE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/muzik.css";

export type SetlistTrack = { name: string; price: string; image: string; imageAlt: string };
export type SetlistCredit = { title: string; description: string };

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_DISC = { rotate: 0 };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * La carte en face A d'un album, sur fond blanc : la liste des plats comme
 * une liste de titres (numéro, nom, prix), et un vinyle qui tourne avec le
 * défilement ; son étiquette montre le plat « en lecture » — celui qui passe
 * au milieu de l'écran, ou celui que survole la souris. Puis les notes de
 * pochette (les atouts de la maison). Reduced motion : disque immobile.
 */
export function MuzikSetlist({ tracks, credits }: { tracks: SetlistTrack[]; credits: SetlistCredit[] }) {
  const t = useTranslations("muzik");
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 900]);
  const current = tracks[active] ?? tracks[0];

  return (
    <section ref={ref} id="carte" aria-labelledby="muzik-setlist-title" data-surface="light" className="muzik-setlist scroll-mt-6">
      <div className="muzik-setlist__inner">
        <header className="muzik-setlist__head">
          <p className="muzik-eyebrow">{t("menuEyebrow")}</p>
          <h2 id="muzik-setlist-title" className="muzik-title">
            {t("menuTitle")}
          </h2>
          <p className="muzik-setlist__lead">{t("menuLead")}</p>
        </header>

        {tracks.length > 0 && (
          <div className="muzik-setlist__grid">
            <div className="muzik-setlist__deck" aria-hidden="true">
              <div className="muzik-setlist__sticky">
                <p className="muzik-setlist__now">
                  <span>{t("menuNow")}</span>
                  {current.name}
                </p>
                <div className="muzik-vinyl">
                  <motion.div className="muzik-vinyl__disc" style={reduced ? STILL_DISC : { rotate }}>
                    <div className="muzik-vinyl__label">
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={current.image}
                          className="absolute inset-0"
                          initial={reduced ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: reduced ? 0 : DURATION_S.base, ease: EASE.luxury }}
                        >
                          <Image src={current.image} alt="" fill sizes="(min-width: 1024px) 14rem, 40vw" className="object-cover" />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                  <span className="muzik-vinyl__arm" />
                </div>
              </div>
            </div>

            <ol className="muzik-setlist__tracks">
              {tracks.map((track, index) => (
                <Track key={track.name} track={track} index={index} active={index === active} onActive={setActive} />
              ))}
            </ol>
          </div>
        )}

        {credits.length > 0 && (
          <div className="muzik-credits">
            <h3 className="muzik-credits__title">{t("creditsTitle")}</h3>
            <ul className="muzik-credits__list">
              {credits.map((credit) => (
                <li key={credit.title}>
                  <span className="muzik-credits__name">{credit.title}</span>
                  <span className="muzik-credits__text">{credit.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Track({
  track,
  index,
  active,
  onActive,
}: {
  track: SetlistTrack;
  index: number;
  active: boolean;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Bande au milieu de l'écran : le titre qui la traverse passe « en lecture ».
  const centered = useInView(ref, { margin: "-46% 0px -46% 0px" });
  useEffect(() => {
    if (centered) onActive(index);
  }, [centered, index, onActive]);

  return (
    <li ref={ref} className={`muzik-track ${active ? "is-active" : ""}`} onPointerEnter={() => onActive(index)}>
      <span aria-hidden="true" className="muzik-track__num">
        {pad(index + 1)}
      </span>
      <span className="muzik-track__name">{track.name}</span>
      <span aria-hidden="true" className="muzik-track__leader" />
      <span className="muzik-track__price">{track.price}</span>
    </li>
  );
}

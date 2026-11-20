"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { StatCountUp } from "@/components/sections/StatCountUp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { CONGO_MAP } from "@/lib/congo-map";
import { ArrowUpRight, X } from "@/lib/icons";
import { EASE } from "@/lib/motion";
import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/about.css";

export type CityHouse = { name: string; href: string; external: boolean };

export type CityCard = {
  city: string;
  /** « RD Congo », « Congo-Brazzaville »… */
  country: string;
  count: number;
  /** « 10 maisons » (repère de la carte). */
  countLabel: string;
  /** « maisons » (à côté du compteur). */
  unit: string;
  houses: CityHouse[];
};

type Labels = {
  hint: string;
  overview: string;
  /** « Zoomer sur {city} » : déjà résolu par ville. */
  show: Record<string, string>;
  newTab: string;
  mapLabel: string;
  countries: { drc: string; congo: string };
};

/** Taille de la carte (viewBox carré) et grossissement sur une ville. */
const VIEW = 600;
const ZOOM = 2.4;
/** Ville d'origine du groupe : départ des arcs. */
const ORIGIN = "Kinshasa";
/** Côté de l'étiquette (villes proches : pas de chevauchement ; bords : rien ne sort). */
const SIDE: Record<string, "right" | "left" | "below"> = {
  Kinshasa: "right",
  "Pointe-Noire": "below",
  Lubumbashi: "left",
};

/** Cadrage (centre, taille) qui montre `city`, sans sortir de la carte. */
function frameOn(city: string | null) {
  const point = city ? CONGO_MAP.cities[city] : null;
  if (!point) return { cx: VIEW / 2, cy: VIEW / 2, size: VIEW };
  const size = VIEW / ZOOM;
  const clamp = (value: number) => Math.min(VIEW - size / 2, Math.max(size / 2, value));
  return { cx: clamp(point[0]), cy: clamp(point[1]), size };
}

/** Arc de Kinshasa vers une ville : courbe tirée vers le nord. */
function arcPath(to: [number, number]) {
  const [x1, y1] = CONGO_MAP.cities[ORIGIN];
  const [x2, y2] = to;
  const lift = Math.max(40, Math.hypot(x2 - x1, y2 - y1) * 0.35);
  return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
}

/**
 * Les villes du groupe sur la carte des deux Congo (page À propos).
 * - À l'arrivée : les frontières se dessinent, les pays se remplissent, les
 *   repères apparaissent puis les arcs partent de Kinshasa vers les autres
 *   villes (le groupe né à Kinshasa, puis ouvert ailleurs). Une seule fois.
 * - Choisir une ville (liste ou repère, souris, doigt ou clavier) zoome la
 *   carte dessus ; « Vue d'ensemble » revient à la carte entière. Les
 *   repères sont des boutons HTML posés sur la carte : ils suivent leur
 *   ville sans grossir. Survol : la ville et son repère se répondent.
 * - Compteurs animés ; maisons cliquables (fiche, ou site officiel).
 * - Souris : la carte s'incline légèrement vers le pointeur.
 * - Reduced motion : tout est affiché d'emblée, zoom sans transition, pas
 *   d'inclinaison.
 * Tracés : lib/congo-map.ts.
 */
export function AboutCities({
  heading,
  cities,
  labels,
}: {
  heading: { eyebrow: string; title: string; sweep: string; intro: string };
  cities: CityCard[];
  labels: Labels;
}) {
  const reduced = useReducedMotionSafe();
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const mapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mapRef, { once: true, amount: 0.3 });
  const shown = reduced || inView;
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const highlighted = hovered ?? selected;
  const onMap = cities.filter((item) => CONGO_MAP.cities[item.city]);

  // Cadrage animé de la carte (centre et taille du viewBox).
  const cx = useMotionValue(VIEW / 2);
  const cy = useMotionValue(VIEW / 2);
  const size = useMotionValue(VIEW);
  const viewBox = useTransform(() => {
    const s = size.get();
    return `${(cx.get() - s / 2).toFixed(2)} ${(cy.get() - s / 2).toFixed(2)} ${s.toFixed(2)} ${s.toFixed(2)}`;
  });

  useEffect(() => {
    const target = frameOn(selected);
    if (reduced) {
      cx.set(target.cx);
      cy.set(target.cy);
      size.set(target.size);
      return;
    }
    const options = { duration: 0.9, ease: EASE.luxury };
    const controls = [animate(cx, target.cx, options), animate(cy, target.cy, options), animate(size, target.size, options)];
    return () => controls.forEach((control) => control.stop());
  }, [selected, reduced, cx, cy, size]);

  // Inclinaison vers le pointeur (souris seulement).
  const tiltX = useSpring(0, { stiffness: 150, damping: 20 });
  const tiltY = useSpring(0, { stiffness: 150, damping: 20 });
  const tilt = !reduced && finePointer;
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tilt || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 7);
    tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 7);
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const toggle = (city: string) => setSelected((current) => (current === city ? null : city));
  // Depuis la liste : au téléphone et à la tablette, la carte est au-dessus,
  // hors de l'écran ; on la ramène pour voir le zoom.
  const selectFromList = (city: string) => {
    const opening = selected !== city;
    toggle(city);
    if (opening && window.matchMedia("(max-width: 1023.98px)").matches) {
      mapRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    }
  };
  const step = (delay: number) => (reduced ? { duration: 0 } : { duration: 1.1, ease: EASE.luxury, delay });

  return (
    <section data-surface="dark" aria-labelledby="about-cities-title" className="about-cities">
      <div className="about-cities__inner">
        <div className="about-cities__head">
          <SectionHeading
            look="editorial"
            eyebrow={heading.eyebrow}
            title={heading.title}
            sweep={heading.sweep}
            description={heading.intro}
            titleAs="h2"
            titleId="about-cities-title"
            align="left"
            className="mb-0"
          />
          <p className="about-cities__hint">{labels.hint}</p>
        </div>

        <ol className="about-cities__list">
          {cities.map((item, index) => {
            const isSelected = selected === item.city;
            return (
              <motion.li
                key={item.city}
                className="about-city"
                data-active={highlighted === item.city ? "" : undefined}
                data-selected={isSelected ? "" : undefined}
                onMouseEnter={() => setHovered(item.city)}
                onMouseLeave={() => setHovered(null)}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: EASE.luxury, delay: index * 0.1 }}
              >
                <button
                  type="button"
                  className="about-city__toggle"
                  aria-pressed={isSelected}
                  aria-label={labels.show[item.city]}
                  onClick={() => selectFromList(item.city)}
                >
                  <span className="about-city__name title-section">{item.city}</span>
                  <span className="about-city__country">{item.country}</span>
                  <span className="about-city__figure">
                    <span className="about-city__count title-display">
                      <StatCountUp value={String(item.count)} />
                    </span>
                    <span className="about-city__unit">{item.unit}</span>
                  </span>
                </button>
                <ul className="about-city__houses">
                  {item.houses.map((house) => (
                    <li key={house.name}>
                      {house.external ? (
                        <a href={house.href} target="_blank" rel="noopener noreferrer" className="about-city__house">
                          {house.name}
                          <ArrowUpRight size={12} aria-hidden="true" />
                          <span className="sr-only"> ({labels.newTab})</span>
                        </a>
                      ) : (
                        <Link href={house.href} className="about-city__house">
                          {house.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ol>

        <div className="about-cities__map-wrap" onPointerMove={onPointerMove} onPointerLeave={resetTilt}>
          <motion.div
            ref={mapRef}
            className="about-cities__map"
            style={tilt ? { rotateX: tiltX, rotateY: tiltY } : undefined}
          >
            <motion.svg viewBox={viewBox} role="img" aria-label={labels.mapLabel} className="about-cities__svg">
              <path d={CONGO_MAP.neighbours} className="about-map__neighbours" />
              {/* Les deux Congo : remplissage en fondu, frontières qui se dessinent. */}
              <motion.path
                d={CONGO_MAP.drc}
                className="about-map__fill about-map__fill--drc"
                initial={reduced ? false : { opacity: 0 }}
                animate={shown ? { opacity: 1 } : undefined}
                transition={step(0.5)}
              />
              <motion.path
                d={CONGO_MAP.congo}
                className="about-map__fill about-map__fill--congo"
                initial={reduced ? false : { opacity: 0 }}
                animate={shown ? { opacity: 1 } : undefined}
                transition={step(0.7)}
              />
              {[CONGO_MAP.drc, CONGO_MAP.congo].map((d, index) => (
                <motion.path
                  key={index}
                  d={d}
                  className="about-map__border"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={shown ? { pathLength: 1 } : undefined}
                  transition={reduced ? { duration: 0 } : { duration: 1.6, ease: EASE.luxury, delay: index * 0.15 }}
                />
              ))}
              <motion.g
                aria-hidden="true"
                initial={reduced ? false : { opacity: 0 }}
                animate={shown ? { opacity: 1 } : undefined}
                transition={step(1)}
              >
                <text x={CONGO_MAP.labels.drc[0]} y={CONGO_MAP.labels.drc[1]} className="about-map__country-label">
                  {labels.countries.drc}
                </text>
                <text x={CONGO_MAP.labels.congo[0]} y={CONGO_MAP.labels.congo[1]} className="about-map__country-label">
                  {labels.countries.congo}
                </text>
              </motion.g>
              {/* Arcs : de Kinshasa vers chaque autre ville. */}
              {onMap
                .filter((item) => item.city !== ORIGIN && CONGO_MAP.cities[ORIGIN])
                .map((item, index) => (
                  <motion.path
                    key={item.city}
                    d={arcPath(CONGO_MAP.cities[item.city])}
                    className="about-map__arc"
                    data-active={highlighted === item.city ? "" : undefined}
                    initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                    animate={shown ? { pathLength: 1, opacity: 1 } : undefined}
                    transition={reduced ? { duration: 0 } : { duration: 1.2, ease: EASE.luxury, delay: 1.7 + index * 0.35 }}
                  />
                ))}
            </motion.svg>

            {/* Repères : boutons HTML posés sur la carte, ils suivent le zoom sans grossir. */}
            <div className="about-cities__pins">
              {onMap.map((item, index) => (
                <CityPin
                  key={item.city}
                  item={item}
                  index={index}
                  cx={cx}
                  cy={cy}
                  size={size}
                  side={SIDE[item.city] ?? "right"}
                  shown={shown}
                  reduced={reduced}
                  active={highlighted === item.city}
                  dim={highlighted !== null && highlighted !== item.city}
                  selected={selected === item.city}
                  label={labels.show[item.city]}
                  onToggle={() => toggle(item.city)}
                  onHover={(on) => setHovered(on ? item.city : null)}
                />
              ))}
            </div>

            <AnimatePresence>
              {selected && (
                <motion.button
                  type="button"
                  className="about-cities__overview"
                  onClick={() => setSelected(null)}
                  initial={reduced ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE.outSoft }}
                >
                  <X size={14} aria-hidden="true" />
                  {labels.overview}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CityPin({
  item,
  index,
  cx,
  cy,
  size,
  side,
  shown,
  reduced,
  active,
  dim,
  selected,
  label,
  onToggle,
  onHover,
}: {
  item: CityCard;
  index: number;
  cx: MotionValue<number>;
  cy: MotionValue<number>;
  size: MotionValue<number>;
  side: "right" | "left" | "below";
  shown: boolean;
  reduced: boolean;
  active: boolean;
  dim: boolean;
  selected: boolean;
  label: string;
  onToggle: () => void;
  onHover: (on: boolean) => void;
}) {
  const [x, y] = CONGO_MAP.cities[item.city];
  // Position dans le cadre courant, en % de la carte.
  const left = useTransform(() => `${((x - (cx.get() - size.get() / 2)) / size.get()) * 100}%`);
  const top = useTransform(() => `${((y - (cy.get() - size.get() / 2)) / size.get()) * 100}%`);
  // Diamètre : surface proportionnelle au nombre de maisons.
  const diameter = Math.round(12 + Math.sqrt(item.count) * 6);
  // Onde à chaque sélection (une seule, pas de boucle).
  const [pulse, setPulse] = useState(0);

  return (
    <motion.div className="about-pin" data-side={side} style={{ left, top }}>
      <motion.button
        type="button"
        className="about-pin__button"
        data-active={active ? "" : undefined}
        data-dim={dim ? "" : undefined}
        aria-pressed={selected}
        aria-label={label}
        onClick={() => {
          onToggle();
          setPulse((n) => n + 1);
        }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        // Le bouton a la taille du point, centré sur la ville.
        style={{ width: diameter, height: diameter, x: "-50%", y: "-50%" }}
        initial={reduced ? false : { opacity: 0, scale: 0.3 }}
        animate={shown ? { opacity: 1, scale: 1 } : undefined}
        transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE.spring, delay: 1.2 + index * 0.18 }}
      >
        <span className="about-pin__dot">
          {!reduced && pulse > 0 && (
            <motion.span
              key={pulse}
              aria-hidden="true"
              className="about-pin__pulse"
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 3 }}
              transition={{ duration: 0.9, ease: EASE.outSoft }}
            />
          )}
        </span>
        <span aria-hidden="true" className="about-pin__pill">
          <span className="about-pin__city">{item.city}</span>
          <span className="about-pin__count">{item.countLabel}</span>
        </span>
      </motion.button>
    </motion.div>
  );
}

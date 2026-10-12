"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, ArrowRight, X } from "@/lib/icons";
import { dynalight } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import { DURATION_S, EASE } from "@/lib/motion";
import type { TeamMember } from "@/lib/types";

import "@/styles/about-team-slider.css";

const GAP_PX = 24;

const PHOTO_FOCAL_POINTS: Record<string, string> = {
  "Kenny Rawtani": "70% 6%",
  "Ritesh Hemnani": "center 10%",
  "Subrajeet Phookan": "center 6%",
  "Ziad Choueiry": "center 8%",
  "Anil Laroia": "center 8%",
};

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  subtitle?: string;
  members: TeamMember[];
  locale?: string;
};

/**
 * Section "Our leadership team / Notre équipe dirigeante" — Page À Propos.
 * Slider moderne inspiré du design de la page d'accueil (MarketPositioningSection / SubsidiariesSlider) :
 * - Fond chaud dégradé sable/or avec grain subtil
 * - En-tête avec typographie Dynalight et boutons de navigation circulaires
 * - Cartes en verre dépoli avec bordure dorée
 * - Portraits des dirigeants affichés avec cadrage précis (visages et bustes complets, sans coupure)
 * - Navigation fluide (drag, swipe, boutons précédent/suivant, points de pagination morphants)
 * - Modal biographie exécutive complète
 */
export function AboutTeamSection({
  eyebrow,
  title,
  description,
  subtitle,
  members,
  locale = "fr",
}: Props) {
  const isFrench = locale.startsWith("fr");
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const trackOuterRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px 0px" });

  const [mounted, setMounted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeBioMember, setActiveBioMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mesure réactive de la largeur du container
  useEffect(() => {
    const el = trackOuterRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Détermination du nombre de cartes visibles selon le breakpoint
  const isMobile = mounted && containerWidth < 640;
  const isTablet = mounted && containerWidth >= 640 && containerWidth < 1024;
  const visibleCount = !mounted ? 3 : isMobile ? 1 : isTablet ? 2 : 3;

  // Calcul largeur carte : sur mobile on laisse dépasser la carte suivante (~86%)
  const cardWidth =
    mounted && containerWidth > 0
      ? isMobile
        ? Math.min(containerWidth * 0.86, 360)
        : (containerWidth - GAP_PX * (visibleCount - 1)) / visibleCount
      : 0;

  const maxIndex = Math.max(members.length - visibleCount, 0);
  const numDots = maxIndex + 1;

  // Recale le défilement au redimensionnement
  useEffect(() => {
    if (!trackOuterRef.current || cardWidth <= 0) return;
    const clamped = Math.min(currentIndex, maxIndex);
    if (clamped !== currentIndex) setCurrentIndex(clamped);
    trackOuterRef.current.scrollLeft = clamped * (cardWidth + GAP_PX);
  }, [cardWidth, maxIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Synchronisation de l'index actif lors du scroll natif / swipe
  useEffect(() => {
    const el = trackOuterRef.current;
    if (!el) return;
    const onScroll = () => {
      if (cardWidth <= 0) return;
      const idx = Math.min(Math.round(el.scrollLeft / (cardWidth + GAP_PX)), maxIndex);
      setCurrentIndex(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [cardWidth, maxIndex]);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.min(Math.max(i, 0), maxIndex);
      setCurrentIndex(clamped);
      trackOuterRef.current?.scrollTo({
        left: clamped * (cardWidth + GAP_PX),
        behavior: "smooth",
      });
    },
    [maxIndex, cardWidth],
  );

  // Support du glisser-déposer à la souris (drag-to-scroll)
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = trackOuterRef.current;
    if (!el) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = trackOuterRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.3;
    if (Math.abs(walk) > 4) hasMoved.current = true;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  // Fermeture du modal par la touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveBioMember(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!members.length) return null;

  return (
    <section
      aria-labelledby="about-team-title"
      className={`ats-section ${dynalight.variable}`}
      ref={sectionRef}
    >
      <div className="ats-container">
        {/* ── En-tête de section ── */}
        <div className="ats-header">
          <motion.div
            className="ats-header-top"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: EASE.luxury }}
          >
            <span aria-hidden className="ats-divider-line" />
            <span className="ats-eyebrow">{eyebrow}</span>
            <span aria-hidden className="ats-divider-line ats-divider-line--rev" />
          </motion.div>

          <motion.h2
            id="about-team-title"
            className="ats-title"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.08 }}
          >
            {title}
          </motion.h2>

          {(description || subtitle) && (
            <motion.p
              className="ats-subtitle"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.14 }}
            >
              {description || subtitle}
            </motion.p>
          )}

          {/* Boutons de navigation (Prev / Next) */}
          <motion.div
            className="ats-controls-row"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.2 }}
          >
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#8c6721]">
              <span>{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="text-[#a67c33]/40">/</span>
              <span>{String(members.length).padStart(2, "0")}</span>
            </div>

            <div className="ats-nav-btns ml-auto">
              <button
                type="button"
                onClick={() => goTo(currentIndex - 1)}
                disabled={currentIndex === 0}
                aria-label={isFrench ? "Dirigeant précédent" : "Previous leader"}
                className="ats-nav-btn"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(currentIndex + 1)}
                disabled={currentIndex >= maxIndex}
                aria-label={isFrench ? "Dirigeant suivant" : "Next leader"}
                className="ats-nav-btn"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Carousel Track ── */}
        <div
          className="ats-track-outer cursor-grab active:cursor-grabbing select-none"
          ref={trackOuterRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="ats-track">
            {members.map((member, i) => {
              const focalPoint = PHOTO_FOCAL_POINTS[member.name] || "center top";

              return (
                <motion.article
                  key={member.name}
                  className="ats-card group"
                  style={cardWidth > 0 ? { width: cardWidth } : undefined}
                  initial={reduced ? false : { opacity: 0, y: 28, scale: 0.96 }}
                  animate={
                    inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }
                  }
                  transition={{
                    duration: DURATION_S.luxe,
                    ease: EASE.luxury,
                    delay: 0.12 + i * 0.08,
                  }}
                >
                  {/* Portrait du dirigeant parfaitement cadré */}
                  <div className="ats-portrait-box">
                    <span className="ats-role-badge">{member.role}</span>

                    <Image
                      src={member.photo}
                      alt={`Portrait de ${member.name}, ${member.role}`}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_PETROL}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 86vw"
                      className="ats-portrait-img pointer-events-none"
                      style={{ objectPosition: focalPoint }}
                    />

                    <div aria-hidden className="ats-portrait-scrim" />
                  </div>

                  {/* Informations du dirigeant */}
                  <div className="ats-card-body">
                    <h3 className="ats-card-name">{member.name}</h3>
                    <p className="ats-card-role">{member.role}</p>

                    {/* Citation inspirante */}
                    {member.quote && (
                      <div className="ats-quote-box">
                        <p className="ats-quote-text">
                          &#8220;{member.quote}&#8221;
                        </p>
                      </div>
                    )}

                    {/* Bouton pour afficher la biographie */}
                    {member.bio && (
                      <button
                        type="button"
                        onClick={() => {
                          if (hasMoved.current) return;
                          setActiveBioMember(member);
                        }}
                        className="ats-bio-btn"
                        aria-label={`${isFrench ? "Lire la biographie de" : "Read biography of"} ${member.name}`}
                      >
                        <span>{isFrench ? "Découvrir le parcours" : "Read biography"}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#b58e48]" />
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* ── Points de pagination morphants (Signature Homepage) ── */}
        {mounted && numDots > 1 && (
          <div className="ats-dots" role="tablist" aria-label="Navigation carrousel équipe">
            {Array.from({ length: numDots }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Slide ${i + 1}`}
                className={`ats-dot${i === currentIndex ? " ats-dot--active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Biographie Exécutive ── */}
      <AnimatePresence>
        {activeBioMember && (
          <motion.div
            className="ats-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveBioMember(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ats-modal-title"
              className="ats-modal-content"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: EASE.luxury }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveBioMember(null)}
                aria-label={isFrench ? "Fermer la biographie" : "Close biography"}
                className="ats-modal-close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Photo dans le modal */}
              <div className="relative min-h-[18rem] md:min-h-full w-full bg-[#f6eee4] overflow-hidden">
                <Image
                  src={activeBioMember.photo}
                  alt={activeBioMember.name}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_PETROL}
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="object-cover"
                  style={{
                    objectPosition:
                      PHOTO_FOCAL_POINTS[activeBioMember.name] || "center top",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                <div className="absolute bottom-4 left-4 right-4 md:hidden text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4ad65]">
                    {activeBioMember.role}
                  </span>
                  <h3 className="text-xl font-bold">{activeBioMember.name}</h3>
                </div>
              </div>

              {/* Contenu textuel dans le modal */}
              <div className="p-6 md:p-8 flex flex-col justify-center max-h-[75vh] overflow-y-auto">
                <div className="hidden md:block">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#a67c33]">
                    {activeBioMember.role}
                  </span>
                  <h3 id="ats-modal-title" className="text-2xl md:text-3xl font-extrabold text-[#1a1208] mt-1">
                    {activeBioMember.name}
                  </h3>
                </div>

                {activeBioMember.quote && (
                  <blockquote className="mt-4 md:mt-5 p-3.5 rounded-xl bg-[#f7f0e6] border-l-3 border-[#b58e48] text-sm md:text-base italic text-[#4a3a2c] leading-relaxed">
                    &#8220;{activeBioMember.quote}&#8221;
                  </blockquote>
                )}

                {activeBioMember.bio && (
                  <div className="mt-5 space-y-3 text-sm md:text-[0.9375rem] leading-relaxed text-[#5c4a3a]">
                    <p>{activeBioMember.bio}</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-[#e2d5c5] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveBioMember(null)}
                    className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[#8c6721] hover:bg-[#f6eee4] transition-colors"
                  >
                    {isFrench ? "Fermer" : "Close"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { CapsuleMenu, type CapsuleMenuProps } from "@/components/navigation/CapsuleMenu";
import { Link, usePathname } from "@/i18n/navigation";
import { CAPSULE_SLOT_ID } from "@/lib/capsule-slot";
import { EASE } from "@/lib/motion";
import { useScrollPercent } from "@/lib/use-scroll-percent";
import { useSurfaceContrast } from "@/lib/use-surface-contrast";

import "@/styles/capsule-nav.css";

/** Ligne de détection du fond : milieu de la capsule (40 px du bas + ~30 px). */
const CONTRAST_LINE_FROM_BOTTOM = 70;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Capsule de navigation des pages groupe (Orbix) : fixée à 40 px du bas,
 * monogramme, pourcentage de lecture et bouton Menu.
 *
 * - Contraste : ivoire sur les fonds sombres, pétrole sur les fonds clairs
 *   (`data-surface`, via useSurfaceContrast) ; pétrole quand le menu est ouvert.
 * - Menu : carte modale au-dessus de la capsule, voile flouté. Bouton natif
 *   (Entrée / Espace), Échap ferme et rend le focus au bouton, Tab reste dans
 *   la capsule et la carte, la page est verrouillée (Lenis stoppé).
 */
export function BottomCapsuleNav(props: CapsuleMenuProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const percent = useScrollPercent();
  const surface = useSurfaceContrast(CONTRAST_LINE_FROM_BOTTOM);
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Le menu est ouvert « sur » une page : il se referme seul quand la page change.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  const close = (returnFocus: boolean) => {
    setOpenOn(null);
    if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenOn(null);
        triggerRef.current?.focus({ preventScroll: true });
        return;
      }
      const wrapper = wrapperRef.current;
      if (event.key !== "Tab" || !wrapper) return;
      const items = Array.from(wrapper.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!wrapper.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const ivory = surface === "dark" && !open;
  const tone = ivory
    ? "bg-neutral text-petrol-panel-4 shadow-[var(--shadow-medium)]"
    : "bg-petrol-panel-4/95 text-ivory shadow-[var(--shadow-medium)]";

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-capsule-nav=""
        data-capsule-tone={ivory ? "ivory" : "petrol"}
        className="pointer-events-none fixed inset-x-0 z-[55] flex justify-center px-4"
        style={{ bottom: "calc(var(--capsule-offset) + env(safe-area-inset-bottom, 0px))" }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              key="veil"
              aria-hidden="true"
              className="pointer-events-auto fixed inset-0 -z-10 bg-petrol-panel-4/30 backdrop-blur-[16px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE.outSoft }}
              onClick={() => close(true)}
            />
          )}
        </AnimatePresence>

        <div ref={wrapperRef} className="capsule-wrap pointer-events-auto relative w-[min(100%,360px)]">
          <AnimatePresence>
            {open && (
              <CapsuleMenu key="menu" id={menuId} {...props} onNavigate={() => close(false)} />
            )}
          </AnimatePresence>

          <div
            className={`relative mx-auto flex min-h-14 w-[calc(100%-16px)] items-center gap-2 rounded-full py-2 pl-5 pr-2 backdrop-blur-[40px] transition-[background-color,color,box-shadow] duration-[350ms] ease-luxury max-md:min-h-16 ${tone}`}
          >
            <Link
              href="/"
              aria-label={`Cen21 Hospitality — ${t("home")}`}
              onClick={() => open && close(false)}
              className="shrink-0 rounded-full px-1 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              {/* Mot-symbole plutôt que le monogramme : ses traits fins disparaissent
                  sous ~48 px. À remplacer par une version pleine du monogramme (SVG). */}
              <span aria-hidden="true" className="title-section text-[1.0625rem] leading-none">
                Cen21
              </span>
            </Link>

            {/* Commandes propres à la page (ex. Grille / Liste sur /evenements),
                rendues ici par portail : voir lib/capsule-slot.ts. */}
            <div id={CAPSULE_SLOT_ID} className="capsule-slot" />

            <span
              aria-hidden="true"
              className="ml-auto border-r border-current/20 pr-3 text-sm font-medium tabular-nums"
            >
              <motion.span>{percent}</motion.span>
              {locale === "fr" ? " %" : "%"}
            </span>

            <button
              ref={triggerRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? tCommon("closeMenu") : tCommon("openMenu")}
              onClick={() => (open ? close(false) : setOpenOn(pathname))}
              className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full px-3 text-sm font-medium transition-opacity duration-fine hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <span aria-hidden="true" className="capsule-burger" />
              <span aria-hidden="true" className="min-w-[3.25rem] text-left">
                {open ? t("close") : t("menu")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

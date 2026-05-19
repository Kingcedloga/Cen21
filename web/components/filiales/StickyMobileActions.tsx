"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 480;

export function StickyMobileActions({
  phone,
  mapsUrl,
  subsidiaryName,
}: {
  phone?: string;
  mapsUrl?: string;
  subsidiaryName: string;
}) {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!phone && !mapsUrl) return null;

  const cleanedPhone = phone?.replace(/\s/g, "");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-label={`Actions rapides ${subsidiaryName}`}
          className="pointer-events-auto fixed inset-x-3 bottom-3 z-40 lg:hidden"
        >
          <div className="flex items-stretch gap-2 rounded-2xl border border-gold/30 bg-petrol/95 p-2 shadow-xl shadow-black/55 backdrop-blur-md">
            {cleanedPhone && (
              <a
                href={`tel:${cleanedPhone}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-3 py-3 text-sm font-semibold text-petrol transition-colors duration-200 hover:brightness-[1.04] active:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                <span>Appeler</span>
              </a>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ivory/20 bg-anthracite/80 px-3 py-3 text-sm font-semibold text-ivory transition-colors duration-200 hover:border-ivory/50 hover:bg-ivory/[0.06] focus-visible:outline-2 focus-visible:outline-ivory cursor-pointer"
              >
                <MapPin className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                <span>Itinéraire</span>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

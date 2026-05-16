"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 600;

export function ScrollToTop() {
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

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Remonter en haut de la page"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-petrol/95 text-ivory shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold hover:text-petrol focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 cursor-pointer md:bottom-8 md:right-8 md:h-14 md:w-14"
        >
          <ArrowUp
            className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 md:h-6 md:w-6"
            strokeWidth={1.75}
            aria-hidden
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

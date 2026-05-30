"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "@/lib/icons";
import { useEffect, useRef } from "react";

import {
  lightboxBackdropVariants,
  lightboxImageVariants,
  lightboxTransition,
} from "@/lib/motion";
import type { GalleryItem } from "@/lib/types";

export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const item = items[index];

  return (
    <motion.div
      key="lightbox"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-petrol/95 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Visionneuse image"
        variants={reduced ? undefined : lightboxBackdropVariants}
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        exit={reduced ? undefined : "exit"}
        transition={lightboxTransition}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-petrol/60 text-ivory transition-colors cursor-pointer hover:bg-petrol/80 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold md:top-6 md:right-6"
          aria-label="Fermer la visionneuse"
        >
          <X className="w-7 h-7" />
        </button>

        <button
          type="button"
          onClick={() =>
            onNavigate((index - 1 + items.length) % items.length)
          }
          className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-petrol/40 text-ivory transition-colors cursor-pointer hover:bg-petrol/70 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold md:left-6"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <motion.div
          key={item.id}
          className="relative z-[1] max-h-[85vh] w-full max-w-5xl aspect-[4/3] border border-gold/35"
          variants={reduced ? undefined : lightboxImageVariants}
          initial={reduced ? false : "hidden"}
          animate={reduced ? undefined : "visible"}
          exit={reduced ? undefined : "exit"}
          transition={lightboxTransition}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
          <p className="absolute -bottom-10 left-0 right-0 text-center text-taupe text-sm">
            {item.alt}
          </p>
        </motion.div>

        <button
          type="button"
          onClick={() => onNavigate((index + 1) % items.length)}
          className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-petrol/40 text-ivory transition-colors cursor-pointer hover:bg-petrol/70 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold md:right-6"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </motion.div>
  );
}

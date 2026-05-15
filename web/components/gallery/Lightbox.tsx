"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-petrol/95 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse image"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-ivory hover:text-gold transition-colors cursor-pointer z-10"
        aria-label="Fermer"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        type="button"
        onClick={() =>
          onNavigate((index - 1 + items.length) % items.length)
        }
        className="absolute left-4 p-2 text-ivory hover:text-gold transition-colors cursor-pointer"
        aria-label="Image précédente"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      <div className="relative max-w-5xl max-h-[85vh] w-full aspect-[4/3]">
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
      </div>

      <button
        type="button"
        onClick={() => onNavigate((index + 1) % items.length)}
        className="absolute right-4 p-2 text-ivory hover:text-gold transition-colors cursor-pointer"
        aria-label="Image suivante"
      >
        <ChevronRight className="w-10 h-10" />
      </button>
    </div>
  );
}

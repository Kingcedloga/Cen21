"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { cormorant } from "@/lib/fonts";
import { X } from "@/lib/icons";
import { DURATION_S, EASE } from "@/lib/motion";
import type { GalleryItem } from "@/lib/types";

import "@/styles/k-lounge-marquee-gallery.css";

const BLUR_BLACK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxNiAxNic+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2JyBmaWxsPScjMDAwMDAwJy8+PC9zdmc+";

// Shared layout transition — ease-luxury 480 ms
const PANEL_TRANSITION = {
  duration: DURATION_S.luxe,
  ease: EASE.luxury,
} as const;

type Props = {
  items: GalleryItem[];
  title: string;
  description: string;
};

type PanelProps = {
  item: GalleryItem;
  layoutId: string;
  onOpen: (item: GalleryItem, id: string) => void;
};

function PanelFigure({ item, layoutId, onOpen }: PanelProps) {
  return (
    <motion.figure
      layoutId={layoutId}
      className="klounge-marquee-gallery__panel"
      onClick={() => onOpen(item, layoutId)}
      whileTap={{ scale: 1.05, transition: { duration: 0.12 } }}
      style={{ cursor: "pointer", originX: 0.5, originY: 0.5 }}
      transition={PANEL_TRANSITION}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="klounge-marquee-gallery__image"
        sizes="(max-width: 767px) 42vw, 16vw"
        quality={88}
        placeholder="blur"
        blurDataURL={BLUR_BLACK}
      />
    </motion.figure>
  );
}

export function KLoungeMarqueeGallery({ items, title, description }: Props) {
  const reduced = useReducedMotion() ?? false;
  const list = items.filter((item) => item.src);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const hoverRef = useRef(false);
  const isWheelingRef = useRef(false);
  const isOpenRef = useRef(false);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const [cursorVisible, setCursorVisible] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<GalleryItem | null>(null);

  const durationSeconds = useMemo(
    () => Math.max(list.length * 5.5, 48),
    [list.length],
  );

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (!openId) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId]);

  // Escape key closes lightbox
  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  const handleOpen = useCallback((item: GalleryItem, id: string) => {
    setOpenId(id);
    setOpenItem(item);
    isOpenRef.current = true;
  }, []);

  const handleClose = useCallback(() => {
    setOpenId(null);
    setOpenItem(null);
    isOpenRef.current = false;
  }, []);

  // JS-driven auto-scroll — same speed as CSS animation, but controllable
  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    track.style.animation = "none";

    let halfWidth = 0;
    let speed = 0;

    const tick = () => {
      if (!halfWidth) {
        halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) speed = halfWidth / (durationSeconds * 60);
      }
      const paused =
        hoverRef.current || isWheelingRef.current || isOpenRef.current;
      if (!paused && halfWidth > 0) {
        offsetRef.current = (offsetRef.current + speed) % halfWidth;
      }
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, durationSeconds]);

  // Wheel → horizontal scroll through the marquee
  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (reduced || isOpenRef.current) return;
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth <= 0) return;

      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      offsetRef.current =
        ((offsetRef.current + delta * 0.9) % halfWidth + halfWidth) % halfWidth;

      isWheelingRef.current = true;
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        isWheelingRef.current = false;
      }, 1500);
    },
    [reduced],
  );

  // Hover (cursor + auto-scroll pause) + wheel listener
  useEffect(() => {
    if (reduced) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onEnter = () => {
      hoverRef.current = true;
      setCursorVisible(true);
    };
    const onLeave = () => {
      hoverRef.current = false;
      setCursorVisible(false);
    };

    viewport.addEventListener("mouseenter", onEnter);
    viewport.addEventListener("mouseleave", onLeave);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      viewport.removeEventListener("mouseenter", onEnter);
      viewport.removeEventListener("mouseleave", onLeave);
      viewport.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [reduced, onWheel]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

  if (list.length === 0) return null;

  const loop = [...list, ...list];

  return (
    <>
      <section
        id="k-lounge-gallery"
        className={`klounge-marquee-gallery ${cormorant.variable}`}
        aria-labelledby="klounge-marquee-gallery-title"
        style={{ "--kl-gallery-duration": `${durationSeconds}s` } as CSSProperties}
      >
        <div className="klounge-marquee-gallery__header">
          <AnimateIn>
            <h2 id="klounge-marquee-gallery-title" className="klounge-marquee-gallery__title">
              {title}
            </h2>
            <p className="klounge-marquee-gallery__description">{description}</p>
          </AnimateIn>
        </div>

        <div
          ref={viewportRef}
          className="klounge-marquee-gallery__viewport"
          aria-label={title}
          onMouseMove={onMouseMove}
        >
          <div
            ref={trackRef}
            className={`klounge-marquee-gallery__track${
              reduced ? " klounge-marquee-gallery__track--static" : ""
            }`}
          >
            {loop.map((item, index) => (
              <PanelFigure
                key={`${item.id}-${index}`}
                item={item}
                layoutId={`klounge-panel-${item.id}-${index}`}
                onOpen={handleOpen}
              />
            ))}
          </div>
        </div>

        <div
          ref={cursorRef}
          className={`klounge-marquee-gallery__cursor${
            cursorVisible ? " klounge-marquee-gallery__cursor--visible" : ""
          }`}
          aria-hidden
        >
          Voir
        </div>
      </section>

      {/* Lightbox — shared layout animation from clicked panel */}
      <AnimatePresence>
        {openId && openItem && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: DURATION_S.base, ease: EASE.luxury },
            }}
            exit={{
              opacity: 0,
              transition: { duration: DURATION_S.base, ease: EASE.luxury },
            }}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label={openItem.alt}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/88" aria-hidden />

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/60 cursor-pointer transition-colors hover:text-[#d4ad65] hover:border-[#d4ad65]/40 focus-visible:outline-2 focus-visible:outline-[#d4ad65]"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Expanded card — morphs from clicked panel via layoutId */}
            <motion.figure
              layoutId={openId}
              transition={PANEL_TRANSITION}
              className="relative z-[1] overflow-hidden"
              style={{
                width: "min(90vw, 28rem)",
                aspectRatio: "13 / 21",
                maxHeight: "85vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={openItem.src}
                alt={openItem.alt}
                fill
                className="object-cover"
                sizes="(max-width: 639px) 90vw, 28rem"
                priority
              />
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

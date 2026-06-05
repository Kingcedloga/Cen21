"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { cormorant } from "@/lib/fonts";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { SubsidiaryTestimonialsSection } from "@/lib/types";

import "@/styles/wabi-sabi-testimonials.css";

export type WabiTestimonialsLabels = {
  carouselLabel: string;
  prevSlide: string;
  nextSlide: string;
  goToSlide: string;
  ratingLabel: string;
};

type Props = {
  section: SubsidiaryTestimonialsSection;
  labels: WabiTestimonialsLabels;
};

const AUTO_ADVANCE_MS = 7000;

function StarRating({ rating, label }: { rating: number; label: string }) {
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div
      className="wabi-testimonials__rating"
      role="img"
      aria-label={label.replace("{rating}", String(clamped))}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`wabi-testimonials__star${i < clamped ? " wabi-testimonials__star--filled" : ""}`}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialAvatar({
  initials,
  image,
  author,
}: {
  initials?: string;
  image?: string;
  author: string;
}) {
  if (image) {
    return (
      <span className="wabi-testimonials__avatar wabi-testimonials__avatar--photo">
        <Image src={image} alt="" fill className="wabi-testimonials__avatar-image" sizes="48px" />
      </span>
    );
  }

  const fallback =
    initials ??
    author
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <span className="wabi-testimonials__avatar" aria-hidden>
      {fallback}
    </span>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  rating,
  avatarInitials,
  avatarImage,
  ratingLabel,
}: {
  quote: string;
  author: string;
  role?: string;
  rating?: number;
  avatarInitials?: string;
  avatarImage?: string;
  ratingLabel: string;
}) {
  return (
    <div className="wabi-testimonials__card">
      <div className="wabi-testimonials__ornaments" aria-hidden>
        <span className="wabi-testimonials__quote-mark wabi-testimonials__quote-mark--open">
          “
        </span>
        <span className="wabi-testimonials__quote-mark wabi-testimonials__quote-mark--close">
          ”
        </span>
        <span className="wabi-testimonials__bracket wabi-testimonials__bracket--tr" />
        <span className="wabi-testimonials__bracket wabi-testimonials__bracket--bl" />
      </div>

      <div className="wabi-testimonials__canvas">
        <blockquote className="wabi-testimonials__quote">
          <p>{quote}</p>
        </blockquote>

        {rating != null && rating > 0 && (
          <StarRating rating={rating} label={ratingLabel} />
        )}

        <footer className="wabi-testimonials__author">
          <TestimonialAvatar
            initials={avatarInitials}
            image={avatarImage}
            author={author}
          />
          <div className="wabi-testimonials__author-meta">
            <cite className="wabi-testimonials__author-name">{author}</cite>
            {role ? <p className="wabi-testimonials__author-role">{role}</p> : null}
          </div>
        </footer>
      </div>
    </div>
  );
}

export function WabiSabiTestimonials({ section, labels }: Props) {
  const { eyebrow, title, items } = section;
  const reduced = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = items.length;
  const hasMultiple = slideCount > 1;

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container || slideCount === 0) return;

      const next = ((index % slideCount) + slideCount) % slideCount;
      const slide = container.children[next] as HTMLElement | undefined;
      if (!slide) return;

      container.scrollTo({ left: slide.offsetLeft, behavior: reduced ? "auto" : "smooth" });
      setActiveIndex(next);
    },
    [reduced, slideCount],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !hasMultiple) return;

    const onScroll = () => {
      const { scrollLeft, clientWidth } = container;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(Math.min(Math.max(index, 0), slideCount - 1));
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [hasMultiple, slideCount]);

  useEffect(() => {
    if (!hasMultiple || reduced) return;

    const timer = window.setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, hasMultiple, reduced, scrollToIndex]);

  const onCarouselKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!hasMultiple) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollToIndex(activeIndex + 1);
      }
    },
    [activeIndex, hasMultiple, scrollToIndex],
  );

  if (slideCount === 0) return null;

  const navButtonClass =
    "wabi-testimonials__nav absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--sub-border)] bg-[var(--sub-bg)]/85 text-[var(--sub-gold)] backdrop-blur-sm transition-[transform,border-color,background-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[rgb(var(--sub-gold-rgb)/0.55)] hover:bg-[rgb(var(--sub-gold-rgb)/0.12)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-35 cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--sub-gold)] focus-visible:outline-offset-2";

  return (
    <section
      className={`wabi-testimonials ${cormorant.variable}`}
      aria-labelledby="wabi-testimonials-title"
    >
      <div className="wabi-testimonials__inner">
        <AnimateIn className="wabi-testimonials__header">
          <p className="wabi-testimonials__eyebrow">{eyebrow}</p>
          <h2 id="wabi-testimonials-title" className="wabi-testimonials__title">
            {title}
          </h2>
        </AnimateIn>

        <div
          className="wabi-testimonials__carousel-wrap"
          role="region"
          aria-roledescription="carousel"
          aria-label={labels.carouselLabel}
          onKeyDown={onCarouselKeyDown}
          tabIndex={hasMultiple ? 0 : undefined}
        >
          <div ref={scrollRef} className="wabi-testimonials__track">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="wabi-testimonials__slide"
                aria-hidden={index !== activeIndex}
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${slideCount}`}
              >
                <TestimonialCard
                  quote={item.quote}
                  author={item.author}
                  role={item.role}
                  rating={item.rating}
                  avatarInitials={item.avatarInitials}
                  avatarImage={item.avatarImage}
                  ratingLabel={labels.ratingLabel}
                />
              </article>
            ))}
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label={labels.prevSlide}
                className={`${navButtonClass} wabi-testimonials__nav--prev`}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={activeIndex === slideCount - 1}
                aria-label={labels.nextSlide}
                className={`${navButtonClass} wabi-testimonials__nav--next`}
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>

              <div
                className="wabi-testimonials__dots"
                role="tablist"
                aria-label={labels.carouselLabel}
              >
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={labels.goToSlide.replace("{index}", String(index + 1))}
                    onClick={() => scrollToIndex(index)}
                    className={`wabi-testimonials__dot${index === activeIndex ? " wabi-testimonials__dot--active" : ""}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { ChevronLeft, ChevronRight, Play, X } from "@/lib/icons";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { dynalight } from "@/lib/fonts";
import { youtubeEmbedUrl, youtubeThumbnailUrl } from "@/lib/youtube";

export type CtaBandVideo = {
  id: string;
  title?: string;
  titleAccent?: string;
};

type CtaBandProps = {
  videos: CtaBandVideo[];
};

const navButtonClass =
  "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-petrol/25 bg-gold text-petrol shadow-sm transition-colors duration-fine hover:border-petrol/45 hover:brightness-[1.04] focus-visible:outline-2 focus-visible:outline-petrol focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-35 md:flex";

type VideoSlideProps = {
  video: CtaBandVideo;
  slideIndex: number;
  slideCount: number;
  isPlaying: boolean;
  defaultTitle: string;
  defaultTitleAccent: string;
  onPlay: () => void;
  onClose: () => void;
};

function VideoSlide({
  video,
  slideIndex,
  slideCount,
  isPlaying,
  defaultTitle,
  defaultTitleAccent,
  onPlay,
  onClose,
}: VideoSlideProps) {
  const t = useTranslations("cta");
  const [thumbQuality, setThumbQuality] = useState<"max" | "hq">("max");

  const title = video.title ?? defaultTitle;
  const titleAccent = video.titleAccent ?? defaultTitleAccent;
  const thumbnailSrc = youtubeThumbnailUrl(video.id, thumbQuality);
  const playAria =
    slideCount > 1
      ? t("playVideoAriaSlide", {
          current: slideIndex + 1,
          total: slideCount,
        })
      : t("playVideoAria");

  return (
    <div className="relative aspect-video w-full">
      {isPlaying ? (
        <>
          <iframe
            src={youtubeEmbedUrl(video.id)}
            title={t("videoTitle")}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeVideoAria")}
            className="absolute right-3 top-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-petrol/80 text-ivory transition-colors duration-fine hover:border-gold/45 hover:bg-petrol hover:text-gold focus-visible:outline-2 focus-visible:outline-petrol focus-visible:outline-offset-2"
          >
            <X className="h-4 w-4" weight="light" aria-hidden />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onPlay}
          aria-label={playAria}
          className="group/video absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-petrol focus-visible:outline-offset-2"
        >
          <Image
            src={thumbnailSrc}
            alt=""
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover transition-transform duration-luxe ease-out group-hover/video:scale-[1.02]"
            onError={() => {
              if (thumbQuality === "max") setThumbQuality("hq");
            }}
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-base group-hover/video:via-black/40"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,173,101,0.16)_0%,transparent_55%)] opacity-80 transition-opacity duration-base group-hover/video:opacity-100"
          />

          <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
            <span className="flex items-center justify-center rounded-xl bg-[#FF0000] px-5 py-3 text-white">
              <Play
                className="ml-1 h-7 w-7 md:h-8 md:w-8"
                weight="fill"
                aria-hidden
              />
            </span>
            <span className="max-w-md text-center font-[family-name:var(--font-dm-sans)] text-lg font-bold leading-snug tracking-[-0.02em] text-white md:text-xl">
              {title} {titleAccent}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export function CtaBand({ videos }: CtaBandProps) {
  const t = useTranslations("cta");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const slideCount = videos.length;
  const hasMultiple = slideCount > 1;
  const defaultTitle = t("title");
  const defaultTitleAccent = t("titleAccent");

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(index, slideCount - 1));
    const slide = container.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setActiveIndex(clamped);
    setPlayingIndex(null);
  }, [slideCount]);

  const handleClose = useCallback(() => {
    setPlayingIndex(null);
  }, []);

  useEffect(() => {
    if (playingIndex == null) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [playingIndex, handleClose]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !hasMultiple) return;

    const onScroll = () => {
      const width = container.clientWidth;
      if (width <= 0) return;
      const index = Math.round(container.scrollLeft / width);
      setActiveIndex(index);
      setPlayingIndex(null);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [hasMultiple]);

  const onCarouselKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!hasMultiple || playingIndex != null) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollToIndex(activeIndex + 1);
      }
    },
    [activeIndex, hasMultiple, playingIndex, scrollToIndex],
  );

  return (
    <section className={`relative bg-ivory px-4 py-24 text-petrol md:px-6 md:py-28 lg:px-8 ${dynalight.variable}`}>
      <AnimateIn>
        <div className="relative mx-auto max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center rounded-full border border-petrol/30 px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.32em] text-petrol [font-family:var(--font-dynalight),cursive]">
              {t("eyebrow")}
            </span>

            <div className="mt-7 w-full md:mt-8">
              {slideCount > 0 ? (
                <div
                  className="relative"
                  role="region"
                  aria-roledescription="carousel"
                  aria-label={t("carouselLabel")}
                  onKeyDown={onCarouselKeyDown}
                  tabIndex={hasMultiple ? 0 : undefined}
                >
                  <div
                    ref={scrollRef}
                    className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {videos.map((video, index) => (
                      <div
                        key={`${video.id}-${index}`}
                        className="w-full shrink-0 snap-center snap-always"
                        aria-hidden={index !== activeIndex}
                      >
                        <div className="overflow-hidden rounded-2xl">
                          <VideoSlide
                            video={video}
                            slideIndex={index}
                            slideCount={slideCount}
                            isPlaying={playingIndex === index}
                            defaultTitle={defaultTitle}
                            defaultTitleAccent={defaultTitleAccent}
                            onPlay={() => setPlayingIndex(index)}
                            onClose={handleClose}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasMultiple && (
                    <>
                      <button
                        type="button"
                        onClick={() => scrollToIndex(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        aria-label={t("prevSlide")}
                        className={`${navButtonClass} -left-4 lg:-left-14`}
                      >
                        <ChevronLeft className="h-5 w-5" weight="light" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToIndex(activeIndex + 1)}
                        disabled={activeIndex === slideCount - 1}
                        aria-label={t("nextSlide")}
                        className={`${navButtonClass} -right-4 lg:-right-14`}
                      >
                        <ChevronRight className="h-5 w-5" weight="light" aria-hidden />
                      </button>

                      <div
                        className="mt-5 flex justify-center gap-2"
                        role="tablist"
                        aria-label={t("carouselLabel")}
                      >
                        {videos.map((video, index) => (
                          <button
                            key={`dot-${video.id}-${index}`}
                            type="button"
                            role="tab"
                            aria-selected={index === activeIndex}
                            aria-label={t("goToSlide", { index: index + 1 })}
                            onClick={() => scrollToIndex(index)}
                            className={`h-2 w-2 cursor-pointer rounded-full transition-colors duration-fine focus-visible:outline-2 focus-visible:outline-petrol focus-visible:outline-offset-2 ${
                              index === activeIndex
                                ? "bg-petrol"
                                : "bg-petrol/25 hover:bg-petrol/45"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-petrol/15 bg-petrol/[0.04] px-6 text-center">
                  <p className="font-[family-name:var(--font-dm-sans)] text-lg font-bold text-petrol">
                    {defaultTitle} {defaultTitleAccent}
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-petrol/80">
                    {t("videoUnavailable")}
                  </p>
                </div>
              )}
            </div>

            <span aria-hidden className="my-7 cta-divider-petrol md:my-8" />

            <p className="max-w-md text-center text-[15px] leading-[1.75] text-petrol md:text-base">
              {t("description")}
            </p>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}

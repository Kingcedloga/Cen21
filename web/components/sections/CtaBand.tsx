"use client";

import { Play, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { youtubeEmbedUrl, youtubeThumbnailUrl } from "@/lib/youtube";

type CtaBandProps = {
  videoId?: string;
};

export function CtaBand({ videoId }: CtaBandProps) {
  const t = useTranslations("cta");
  const [playing, setPlaying] = useState(false);
  const [thumbQuality, setThumbQuality] = useState<"max" | "hq">("max");

  const handlePlay = useCallback(() => {
    if (!videoId) return;
    setPlaying(true);
  }, [videoId]);

  const handleClose = useCallback(() => {
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [playing, handleClose]);

  const thumbnailSrc = videoId
    ? youtubeThumbnailUrl(videoId, thumbQuality)
    : undefined;

  return (
    <section className="relative bg-petrol px-4 py-24 md:px-6 md:py-28 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[520px] max-w-4xl -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(212,173,101,0.2)_0%,rgba(212,173,101,0.05)_42%,transparent_68%)]"
      />

      <AnimateIn>
        <div className="relative mx-auto max-w-4xl">
          <div className="luxury-grain cta-card relative overflow-hidden rounded-[2rem] border border-white/[0.08] p-6 md:p-8 lg:p-10">
            <div className="relative z-10 flex flex-col items-center">
              <span className="inline-flex items-center rounded-full border border-gold/45 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
                {t("eyebrow")}
              </span>

              <div className="mt-7 w-full md:mt-8">
                {videoId ? (
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-petrol-panel-4 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05),0_24px_60px_-24px_rgb(0_0_0/0.65)]">
                    <div className="relative aspect-video w-full">
                      {playing ? (
                        <>
                          <iframe
                            src={youtubeEmbedUrl(videoId)}
                            title={t("videoTitle")}
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                          <button
                            type="button"
                            onClick={handleClose}
                            aria-label={t("closeVideoAria")}
                            className="absolute right-3 top-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-petrol/80 text-ivory backdrop-blur-sm transition-colors duration-200 hover:border-gold/45 hover:bg-petrol hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
                          >
                            <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePlay}
                          aria-label={t("playVideoAria")}
                          className="group/video absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-[-2px]"
                        >
                          {thumbnailSrc && (
                            <Image
                              src={thumbnailSrc}
                              alt=""
                              fill
                              sizes="(max-width: 896px) 100vw, 896px"
                              className="object-cover transition-transform duration-500 ease-out group-hover/video:scale-[1.02]"
                              onError={() => {
                                if (thumbQuality === "max") setThumbQuality("hq");
                              }}
                            />
                          )}
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-t from-petrol-panel-4/90 via-petrol/45 to-petrol/25 transition-opacity duration-300 group-hover/video:via-petrol/35"
                          />
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,173,101,0.18)_0%,transparent_55%)] opacity-80 transition-opacity duration-300 group-hover/video:opacity-100"
                          />

                          <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                            <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-gold/50 bg-petrol/55 text-gold shadow-[0_0_40px_-8px_rgb(var(--color-gold-rgb)/0.55),inset_0_1px_0_0_rgb(255_255_255/0.12)] backdrop-blur-sm transition-all duration-300 group-hover/video:border-gold/70 group-hover/video:bg-petrol/70 group-hover/video:shadow-[0_0_52px_-6px_rgb(var(--color-gold-rgb)/0.7),inset_0_1px_0_0_rgb(255_255_255/0.16)] md:h-20 md:w-20">
                              <Play
                                className="ml-1 h-7 w-7 fill-current md:h-8 md:w-8"
                                strokeWidth={0}
                                aria-hidden
                              />
                            </span>
                            <span className="max-w-md text-center font-[family-name:var(--font-dm-sans)] text-lg font-bold leading-snug tracking-[-0.02em] text-gradient-gold-vertical md:text-xl">
                              {t("title")} {t("titleAccent")}
                            </span>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-petrol-panel-4/80 px-6 text-center">
                    <p className="font-[family-name:var(--font-dm-sans)] text-lg font-bold text-gradient-gold-vertical">
                      {t("title")} {t("titleAccent")}
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/70">
                      {t("videoUnavailable")}
                    </p>
                  </div>
                )}
              </div>

              <span aria-hidden className="my-7 cta-card-divider md:my-8" />

              <p className="max-w-md text-center text-[15px] leading-[1.75] text-ivory/75 md:text-base">
                {t("description")}
              </p>
            </div>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}

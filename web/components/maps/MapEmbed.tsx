"use client";

import { ExternalLink } from "@/lib/icons";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import {
  defaultScrollViewport,
  fadeInTransition,
  fadeInVariants,
} from "@/lib/motion";
import {
  googleMapsEmbedUrl,
  googleMapsExternalUrl,
} from "@/lib/map";

type MapEmbedProps = {
  /** Adresse ou lieu à afficher */
  query: string;
  title?: string;
  className?: string;
  /** "banner" : bandeau large, coins arrondis en haut uniquement (cf. carte Gourmet Mexicana) */
  variant?: "default" | "compact" | "banner";
};

/**
 * Carte responsive avec lien d'ouverture externe (accessibilité : titre iframe).
 */
export function MapEmbed({
  query,
  title = "Carte",
  className = "",
  variant = "default",
}: MapEmbedProps) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");

  if (!query.trim()) return null;

  const src = googleMapsEmbedUrl(query);
  const external = googleMapsExternalUrl(query);
  const compact = variant === "compact";
  const banner = variant === "banner";

  return (
    <motion.div
      className={`glass-panel overflow-hidden border border-white/10 ${
        banner ? "rounded-t-2xl" : "rounded-2xl"
      } ${compact ? "max-w-3xl" : ""} ${className}`}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={defaultScrollViewport}
      variants={reduced ? undefined : fadeInVariants}
      transition={fadeInTransition}
    >
      <div
        className={`relative w-full ${
          banner
            ? "h-[clamp(300px,42vw,480px)]"
            : compact
              ? "aspect-[21/9] min-h-[140px] sm:min-h-[168px] md:min-h-[180px]"
              : "aspect-[4/3] min-h-[220px] md:min-h-[280px]"
        }`}
      >
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.15] contrast-[1.02]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div
        className={`flex items-center justify-between gap-4 border-t border-white/10 ${
          compact ? "px-4 py-3" : "px-5 py-4"
        }`}
      >
        <p className={`truncate text-taupe ${compact ? "text-xs" : "text-sm"}`}>
          {query}
        </p>
        <a
          href={external}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex shrink-0 items-center gap-1.5 font-medium text-gold transition-colors hover:text-ivory cursor-pointer ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {t("mapOpenExternal")}
          <ExternalLink className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
        </a>
      </div>
    </motion.div>
  );
}

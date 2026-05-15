import { ExternalLink } from "lucide-react";

import {
  googleMapsEmbedUrl,
  googleMapsExternalUrl,
} from "@/lib/map";

type MapEmbedProps = {
  /** Adresse ou lieu à afficher */
  query: string;
  title?: string;
  className?: string;
};

/**
 * Carte responsive avec lien d’ouverture externe (accessibilité : titre iframe).
 */
export function MapEmbed({ query, title = "Carte", className = "" }: MapEmbedProps) {
  if (!query.trim()) return null;

  const src = googleMapsEmbedUrl(query);
  const external = googleMapsExternalUrl(query);

  return (
    <div className={`glass-panel overflow-hidden rounded-2xl ${className}`}>
      <div className="relative aspect-[4/3] w-full min-h-[220px] md:min-h-[280px]">
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
        <p className="truncate text-sm text-taupe">{query}</p>
        <a
          href={external}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-ivory cursor-pointer"
        >
          Agrandir la carte
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}

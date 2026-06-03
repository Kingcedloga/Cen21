import type { EventItem } from "./types";

const EVENT_IMAGE_FALLBACK = "/filiales/logos/filiale-04.png";

/**
 * Affiches événements Millionaire Club — `/public/filiales/photos/filiale-04/events/`.
 * Convention : `{index}-{slug-court}.webp` — remplacer le fichier sans toucher au JSON.
 */
export const MILLIONAIRE_CLUB_EVENT_POSTERS = {
  urbanWednesday: "/filiales/photos/filiale-04/events/01-urban-wednesday.webp",
  frenchTouch: "/filiales/photos/filiale-04/events/02-french-touch-night.webp",
  neonSaturday: "/filiales/photos/filiale-04/events/03-neon-saturday.webp",
  afroFusion: "/filiales/photos/filiale-04/events/04-afro-fusion-sunday.webp",
  africanTribal: "/filiales/photos/filiale-04/events/05-african-tribal-night.webp",
} as const;

/**
 * Chemin d'affiche événement — préfère le chemin local `/public/...`.
 * Fallback sur la couverture filiale si l'image est absente.
 */
export function resolveEventImage(
  event: Pick<EventItem, "image" | "subsidiarySlug">,
  subsidiaryCover?: string,
): string {
  const src = event.image?.trim();
  if (src?.startsWith("/")) return src;
  if (src?.startsWith("http")) return src;
  return subsidiaryCover ?? EVENT_IMAGE_FALLBACK;
}

import type { Locale } from "@/i18n/routing";
import { resolveSubsidiaryHeroVideo } from "@/lib/subsidiary-hero-layout";
import { getSubsidiaryPageTheme } from "@/lib/subsidiary-themes";
import type { Subsidiary } from "@/lib/types";

/**
 * Données d'une fiche filiale, calculées une fois par page et partagées par
 * les compositions (components/filiales/pages/*) : charte de la maison,
 * vidéo du hero, adresse pour la carte et l'itinéraire.
 */
export async function buildFilialeContext(locale: Locale, subsidiary: Subsidiary) {
  const slug = subsidiary.slug;
  const pageTheme = getSubsidiaryPageTheme(slug);
  const heroVideo = resolveSubsidiaryHeroVideo(slug, subsidiary.heroVideo);

  const mapQuery =
    subsidiary.practicalInfo.address?.trim() || subsidiary.practicalInfo.phone?.trim() || subsidiary.name;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return { locale, slug, subsidiary, pageTheme, heroVideo, mapQuery, mapsUrl };
}

export type FilialeContext = Awaited<ReturnType<typeof buildFilialeContext>>;

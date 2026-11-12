import type { ContactHouse } from "@/components/contact/ContactForm";
import type { Locale } from "@/i18n/routing";
import { getSubsidiaries } from "@/lib/content";
import { galleryEntrySrc } from "@/lib/gallery-categories";
import type { GalleryPhoto } from "@/lib/gallery-photos";
import { brandSurface } from "@/lib/subsidiary-brand";
import type { Subsidiary } from "@/lib/types";

/** Photos de la maison pour la bande et la visionneuse. */
export function filialePhotos(subsidiary: Subsidiary, altFor: (n: number) => string): GalleryPhoto[] {
  return subsidiary.galleryImages.map((entry, index) => ({
    id: `${subsidiary.slug}-${index}`,
    src: galleryEntrySrc(entry),
    alt: altFor(index + 1),
    houseSlug: subsidiary.slug,
  }));
}

/** Maisons dotées d'une fiche (les franchises redirigent vers leur site). */
export function ownHouses(locale: Locale): Subsidiary[] {
  return getSubsidiaries(locale).filter((s) => !s.externalUrl);
}

/** Maisons du formulaire de réservation (pastilles masquées, maison fixée). */
export function contactHouses(locale: Locale): ContactHouse[] {
  return ownHouses(locale).map((s) => ({
    slug: s.slug,
    name: s.name,
    logo: s.brandLogo,
    logoSurface: brandSurface(s.slug, s.accentColor),
  }));
}

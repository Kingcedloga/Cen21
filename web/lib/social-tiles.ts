import type { SocialTile } from "@/components/contact/SocialTiles";
import { brandSurface } from "@/lib/subsidiary-brand";
import type { Subsidiary } from "@/lib/types";

/** Tuile réseau d'une filiale : Instagram, Facebook à défaut (Contact, Galerie). */
export function socialTile(s: Subsidiary): SocialTile | null {
  const instagram = s.social.instagram;
  const href = instagram ?? s.social.facebook;
  if (!href) return null;
  let handle = s.name;
  if (instagram) {
    try {
      const account = new URL(instagram).pathname.split("/").filter(Boolean)[0];
      if (account) handle = `@${account}`;
    } catch {
      // adresse invalide : on garde le nom de la maison
    }
  }
  return {
    slug: s.slug,
    name: s.name,
    network: instagram ? "Instagram" : "Facebook",
    href,
    handle,
    logo: s.brandLogo,
    logoSurface: brandSurface(s.slug, s.accentColor),
  };
}

/** Tuiles de toutes les maisons qui ont un réseau. */
export function socialTiles(subsidiaries: Subsidiary[]): SocialTile[] {
  return subsidiaries.map(socialTile).filter((tile): tile is SocialTile => tile !== null);
}

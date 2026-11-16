/** Domaine officiel du site : origine des URL absolues (Open Graph, canonique, sitemap…). */
export const PRODUCTION_ORIGIN = "https://cen21hospitality.com";

function normalizeOrigin(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Origine absolue du site, résolue au build : `NEXT_PUBLIC_SITE_URL` si elle
 * est définie (préproduction, autre domaine), sinon le domaine officiel
 * cen21hospitality.com.
 *
 * Jamais l'adresse d'un déploiement (`*.vercel.app`, prévisualisations
 * Netlify) ni `localhost` : les balises Open Graph, les URL canoniques, le
 * sitemap, robots.txt et les données structurées désignent toujours le site
 * public, quel que soit l'endroit où la page a été construite.
 *
 * Volontairement statique : une origine résolue par requête (`headers()`)
 * empêche Next.js de pré-rendre les pages.
 */
export function getCanonicalOrigin(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL;
  return override?.trim() ? normalizeOrigin(override) : PRODUCTION_ORIGIN;
}

/** Origine absolue du site pour metadataBase, OG, sitemap, JSON-LD — résolue au build. */
export async function getSiteOrigin(): Promise<string> {
  return getCanonicalOrigin();
}

/** @deprecated Préférer `getSiteOrigin()` — valeur build-time sans contexte requête. */
export const SITE_URL = getCanonicalOrigin();

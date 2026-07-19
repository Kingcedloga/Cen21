function normalizeOrigin(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Origine de secours résolue au build à partir des variables d'environnement
 * injectées par la plateforme de déploiement — jamais depuis les en-têtes de
 * la requête. Priorité : domaine de production stable (Vercel) → domaine du
 * déploiement courant (Vercel/Netlify) → override manuel → localhost.
 *
 * Volontairement statique : une origine résolue par requête (`headers()`)
 * empêche Next.js de pré-rendre les pages (tout le site passait en rendu
 * dynamique côté serveur à chaque requête, sans cache CDN/Edge).
 */
export function getDeployOrigin(): string | undefined {
  const candidates = [
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.NEXT_PUBLIC_SITE_URL,
  ];

  for (const candidate of candidates) {
    if (candidate?.trim()) return normalizeOrigin(candidate);
  }

  return undefined;
}

/** Origine absolue du site pour metadataBase, OG, sitemap, JSON-LD — résolue au build. */
export async function getSiteOrigin(): Promise<string> {
  return getDeployOrigin() ?? "http://localhost:3000";
}

/** @deprecated Préférer `getSiteOrigin()` — valeur build-time sans contexte requête. */
export const SITE_URL = getDeployOrigin() ?? "http://localhost:3000";

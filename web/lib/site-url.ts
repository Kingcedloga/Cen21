import { headers } from "next/headers";

function normalizeOrigin(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`; 
}

function originFromHost(host: string, proto?: string | null): string {
  const hostname = host.split(",")[0]?.trim();
  if (!hostname) return "http://localhost:3000";

  const protocol =
    proto?.split(",")[0]?.trim() ??
    (hostname.startsWith("localhost") || hostname.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${hostname}`;
}

/** Origine de secours quand `headers()` n'est pas disponible (build, scripts). */
export function getDeployOrigin(): string | undefined {
  const candidates = [
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

/**
 * Origine absolue du site pour metadataBase, OG, sitemap, JSON-LD.
 * Priorité : en-têtes de la requête (domaine courant) → variables de déploiement → localhost.
 */
export async function getSiteOrigin(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      return originFromHost(host, h.get("x-forwarded-proto"));
    }
  } catch {
    // Hors contexte requête (build statique, tests).
  }

  return getDeployOrigin() ?? "http://localhost:3000";
}

/** @deprecated Préférer `getSiteOrigin()` — valeur build-time sans contexte requête. */
export const SITE_URL = getDeployOrigin() ?? "http://localhost:3000";

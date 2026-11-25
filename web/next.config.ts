import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { REMOTE_IMAGE_HOSTS } from "./lib/events-sheet";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Cache navigateur des médias de public/ (images, vidéos, logos). Vercel les
 * sert par défaut en `max-age=0` : le navigateur redemande chaque fichier à
 * chaque page. Les noms de fichiers ne sont pas versionnés (un média remplacé
 * garde son nom) : 1 jour de cache franc, puis une semaine de service immédiat
 * pendant qu'il se revalide en arrière-plan.
 * `/_next/static` (fichiers hachés) garde son `immutable` d'origine : aucune
 * règle ci-dessous ne le touche.
 */
const MEDIA_CACHE = [
  { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      "/home/:path*",
      "/filiales/:path*",
      "/brand/:path*",
      "/events/:path*",
      "/logo.png",
      "/og-image.png",
      "/icon-192.png",
      "/apple-icon-180.png",
      "/kloungecover.jpg",
    ].map((source) => ({ source, headers: MEDIA_CACHE }));
  },
  experimental: {
    // CSS dans le <head> au lieu de ~14 fichiers .css bloquants au rendu (une
    // requête chacun) : FCP/LCP en réseau lent. Les pages sont statiques et
    // servies par le CDN, le HTML porte donc son CSS sans coût serveur.
    inlineCss: true,
  },
  images: {
    // Hôtes d'images distants, dont Google Drive (affiches de l'agenda) : lib/events-sheet.ts.
    remotePatterns: REMOTE_IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
};

export default withNextIntl(nextConfig);

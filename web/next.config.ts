import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { REMOTE_IMAGE_HOSTS } from "./lib/events-sheet";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
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

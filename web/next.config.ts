import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { REMOTE_IMAGE_HOSTS } from "./lib/events-sheet";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Hôtes d'images distants, dont Google Drive (affiches de l'agenda) : lib/events-sheet.ts.
    remotePatterns: REMOTE_IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
};

export default withNextIntl(nextConfig);

/** URL canonique du site (OG, sitemap). Surcharge en prod avec NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
    process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")) ||
  "https://cen21hospitality.com";

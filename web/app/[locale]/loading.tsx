"use client";

import { useTranslations } from "next-intl";

import { LoaderGraphic } from "@/components/brand/LoaderGraphic";

// Composant client : `getTranslations()` côté serveur lit les en-têtes de la
// requête (headers()) quand la locale n'est pas posée par setRequestLocale, ce
// qui rendait toutes les pages dynamiques (jamais mises en cache par le CDN).
// Les messages viennent du NextIntlClientProvider du layout.
export default function Loading() {
  const t = useTranslations("common");

  return (
    <div
      // Plein écran : au premier chargement, React révèle la page ~300 ms après
      // cet état ; plus court, il laissait voir le pied de page, que la page
      // repoussait ensuite (CLS 0,5 mesuré par Lighthouse).
      className="flex min-h-svh items-center justify-center bg-petrol py-24"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={t("loadingSite")}
    >
      <LoaderGraphic />
    </div>
  );
}

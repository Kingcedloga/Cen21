import { getTranslations } from "next-intl/server";

import { LoaderGraphic } from "@/components/brand/LoaderGraphic";

export default async function Loading() {
  const t = await getTranslations("common");

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

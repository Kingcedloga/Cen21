import { getTranslations } from "next-intl/server";

import { LoaderGraphic } from "@/components/brand/LoaderGraphic";

export default async function Loading() {
  const t = await getTranslations("common");

  return (
    <div
      className="flex min-h-[50vh] items-center justify-center bg-petrol py-24"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={t("loadingSite")}
    >
      <LoaderGraphic />
    </div>
  );
}

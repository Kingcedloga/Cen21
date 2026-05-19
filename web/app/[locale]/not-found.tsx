import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { PageSection } from "@/components/layout/PageSection";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <PageSection variant="default" className="min-h-[60vh] flex items-center">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">{t("code")}</p>
        <h1 className="text-4xl md:text-5xl text-ivory mb-4">
          {t("title")}
        </h1>
        <p className="text-taupe mb-8">{t("description")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">{t("home")}</Button>
          <Button href="/filiales" variant="secondary">
            {t("subsidiaries")}
          </Button>
        </div>
      </div>
    </PageSection>
  );
}

import { getTranslations } from "next-intl/server";

import { SubsidiariesArc, type ArcItem } from "@/components/filiales/SubsidiariesArc";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { getSectorLabel, getSubsidiaries } from "@/lib/content";
import { brandSurface } from "@/lib/subsidiary-brand";

/** Les autres maisons du groupe en éventail (slider de l'accueil), à la place de la rangée de logos. */
export async function FilialeOtherHouses({ slug, locale }: { slug: string; locale: Locale }) {
  const t = await getTranslations("filiale");
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const others = getSubsidiaries(locale).filter((s) => s.slug !== slug);
  const items: ArcItem[] = others.map((s, index) => ({
    slug: s.slug,
    name: s.name,
    sector: getSectorLabel(locale, s.sector),
    tagline: s.tagline,
    cover: s.coverImage,
    logo: s.brandLogo,
    brandColor: brandSurface(s.slug, s.accentColor),
    ariaLabel: tCommon("discover", { name: s.name }),
    positionLabel: tHome("arcPosition", { index: index + 1, total: others.length, name: s.name }),
  }));

  return (
    <div className="relative isolate">
      <SectionHeading
        look="editorial"
        eyebrow={t("othersEyebrow")}
        title={t("othersTitle")}
        sweep={t("othersSweep")}
        titleAs="h2"
        titleId="filiale-others-title"
        align="left"
        className="mb-0! max-w-2xl"
      />
      <div className="relative z-10 mt-12 md:mt-16">
        <SubsidiariesArc
          items={items}
          labels={{
            region: t("othersTitle"),
            roledescription: tHome("arcRoledescription"),
            prev: tHome("arcPrev"),
            next: tHome("arcNext"),
            drag: tHome("arcDrag"),
            discover: tHome("arcDiscover"),
          }}
        />
      </div>
    </div>
  );
}

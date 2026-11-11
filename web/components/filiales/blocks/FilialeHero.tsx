import { getTranslations } from "next-intl/server";

import { InnerHero } from "@/components/sections/InnerHero";
import { Button } from "@/components/ui/Button";
import { getSectorLabel } from "@/lib/content";
import { ExternalLink, Phone } from "@/lib/icons";
import type { Locale } from "@/i18n/routing";
import type { Subsidiary } from "@/lib/types";

import { FilialeOpenStatus } from "./FilialeOpenStatus";

/**
 * Hero d'une fiche (socle R5) : le hero des pages intérieures aux couleurs de
 * la maison — secteur, nom révélé lettre à lettre, accroche et état
 * d'ouverture, photo qui s'ouvre au défilement. Actions : réserver (formulaire
 * de la fiche), itinéraire, appeler. Dans un <HeroCurtain>, passer
 * `className="hero-curtain__hero"`.
 */
export async function FilialeHero({
  subsidiary,
  locale,
  image,
  mapsUrl,
  className,
}: {
  subsidiary: Subsidiary;
  locale: Locale;
  image: string;
  mapsUrl: string;
  className?: string;
}) {
  const t = await getTranslations("filiale");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const tContact = await getTranslations("contact");
  const { phone, hours } = subsidiary.practicalInfo;

  return (
    <InnerHero
      className={className}
      titleId="filiale-hero-title"
      eyebrow={getSectorLabel(locale, subsidiary.sector)}
      title={subsidiary.name}
      description={
        <>
          {subsidiary.tagline}
          {hours && <FilialeOpenStatus hours={hours} locale={locale} />}
        </>
      }
      image={image}
      breadcrumb={{
        label: tCommon("breadcrumb"),
        home: tNav("home"),
        parent: { label: tNav("subsidiaries"), href: "/filiales" },
        current: subsidiary.name,
      }}
      actions={
        <>
          <Button href="#reservation" native magnetic>
            {t("reserve")}
          </Button>
          <Button href={mapsUrl} external variant="secondary">
            {tCommon("directions")}
            <ExternalLink size={16} aria-hidden="true" />
            <span className="sr-only"> ({tContact("newTab")})</span>
          </Button>
          {phone && (
            <Button href={`tel:${phone.replace(/\s/g, "")}`} native variant="secondary">
              <Phone size={16} aria-hidden="true" />
              {tCommon("call")}
            </Button>
          )}
        </>
      }
    />
  );
}

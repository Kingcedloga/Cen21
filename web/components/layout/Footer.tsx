import { getTranslations } from "next-intl/server";

import { getSiteConfig } from "@/lib/content";
import { getContentLocale } from "@/lib/locale-server";

import { NAV_PATHS } from "./nav-links";
import { FooterView } from "./FooterView";

export async function Footer() {
  const locale = await getContentLocale();
  const site = getSiteConfig(locale);
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const navLabels = Object.fromEntries(
    NAV_PATHS.map(({ key }) => [key, tNav(key)]),
  ) as Record<string, string>;

  return (
    <FooterView
      site={site}
      labels={{
        contact: t("contact"),
        networks: t("networks"),
        events: t("events"),
        quickContact: t("quickContact"),
        quickAccess: t("quickAccess"),
        legalNotice: t("legalNotice"),
        privacy: t("privacy"),
        cookies: t("cookies"),
        allRights: tCommon("allRights"),
        legalNav: tCommon("legalNav"),
        nav: navLabels,
      }}
    />
  );
}

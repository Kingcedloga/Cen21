import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageSection } from "@/components/layout/PageSection";
import { GradientSweep } from "@/components/motion/GradientSweep";
import { RollingText } from "@/components/motion/RollingText";
import { SpectrumText } from "@/components/motion/SpectrumText";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

import { ScrollReadout } from "./_components/ScrollReadout";
import { TrackDemo } from "./_components/TrackDemo";
import { WeightComparison } from "./_components/WeightComparison";

/**
 * Laboratoire des primitives de mouvement (rapport « Orbix × Cen21 »).
 * Page de travail : répond uniquement si le serveur tourne avec MOTION_LAB=1,
 * non indexée, absente du sitemap et de la navigation.
 */

type Props = { params: Promise<{ locale: string }> };

function isLabEnabled() {
  return process.env.MOTION_LAB === "1";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "motionLab" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

const NAV_KEYS = ["home", "subsidiaries", "events", "gallery", "contact"] as const;
const NAV_HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  home: "/",
  subsidiaries: "/filiales",
  events: "/evenements",
  gallery: "/galerie",
  contact: "/contact",
};

export default async function MotionLabPage({ params }: Props) {
  if (!isLabEnabled()) notFound();

  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("motionLab");
  const tNav = await getTranslations("nav");
  const tHero = await getTranslations("hero");

  return (
    <>
      <section data-surface="dark" className="bg-petrol-panel-4 px-4 pb-28 pt-36 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow text-xs uppercase tracking-[0.18em] text-gold">{t("eyebrow")}</p>
          <p className="mt-3 max-w-2xl text-ivory/70">{t("intro")}</p>
          <h2 className="mt-12 font-mono text-sm font-normal uppercase tracking-[0.12em] text-ivory/60">
            {t("weightHeading")}
          </h2>
          <WeightComparison
            title={t("title")}
            sweep={t("titleSweep")}
            replayLabel={t("replay")}
            labels={{
              700: t("weightCurrent", { weight: 700 }),
              600: t("weight", { weight: 600 }),
              500: t("weight", { weight: 500 }),
            }}
          />
        </div>
      </section>

      <PageSection variant="light" spacing="loose">
        <SpectrumText
          as="h2"
          mode="scroll"
          tone="light"
          text={t("lightTitle")}
          sweep={t("lightTitleSweep")}
          className="title-section max-w-4xl text-h2 text-petrol"
        />
        <p className="mt-8 max-w-2xl text-lead text-petrol/80">
          {t.rich("lightBody", {
            sweep: (chunks) => <GradientSweep tone="light">{chunks}</GradientSweep>,
          })}
        </p>
      </PageSection>

      <PageSection variant="dark" spacing="loose">
        <SpectrumText
          as="h2"
          mode="scroll"
          text={t("darkTitle")}
          sweep={t("darkTitleSweep")}
          className="title-section max-w-4xl text-h2 text-ivory"
        />

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-gold">{t("linksHeading")}</h3>
            <ul className="mt-6 flex flex-col gap-3 text-lg text-ivory/85">
              {NAV_KEYS.map((key) => (
                <li key={key}>
                  <Link href={NAV_HREFS[key]} className="hover:text-gold focus-visible:outline-2 focus-visible:outline-gold">
                    <RollingText text={tNav(key)} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-gold">{t("buttonsHeading")}</h3>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button href="/filiales" magnetic>
                {tHero("ctaSubsidiaries")}
              </Button>
              <Button href="/contact" variant="secondary" magnetic>
                {tHero("ctaContact")}
              </Button>
            </div>
          </div>
        </div>
      </PageSection>

      <TrackDemo title={t("trackHeading")} body={t("trackBody")} cardLabel={t("trackCard")} />

      <PageSection variant="light" spacing="loose">
        <p className="title-section text-h3 text-petrol">{t("end")}</p>
      </PageSection>

      <ScrollReadout label={t("readout")} dark={t("surfaceDark")} light={t("surfaceLight")} />
    </>
  );
}

import { getTranslations } from "next-intl/server";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";
import { ArrowUpRight } from "@/lib/icons";
import type { EventItem } from "@/lib/types";

import "@/styles/mexicana.css";

/**
 * Les prochaines fiestas, sur le vert de la charte : chaque date dans un
 * drapeau de papel picado rouge, le titre à la main, l'heure et l'accroche,
 * puis « Réserver » (formulaire de la fiche). Lien vers l'agenda filtré sur
 * la maison. Rien si aucune fiesta.
 */
export async function MexicanaFiestas({ events, locale, slug }: { events: EventItem[]; locale: Locale; slug: string }) {
  const t = await getTranslations("mexicana");
  if (events.length === 0) return null;
  const intl = locale === "fr" ? "fr-FR" : "en-GB";
  const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(intl, options).format(date).replace(/\./g, "");

  return (
    <section aria-labelledby="mexicana-fiestas-title" data-surface="dark" className="mx-fiestas">
      <div className="mx-fiestas__inner">
        <header className="mx-fiestas__head">
          <div>
            <p className="mx-eyebrow">{t("fiestasEyebrow")}</p>
            <h2 id="mexicana-fiestas-title" className="mx-title">
              {t("fiestasTitle")}
            </h2>
          </div>
          <Button href={`/evenements?maison=${slug}`} variant="secondary">
            {t("fiestasAll")}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </header>

        <ol className="mx-fiestas__list">
          {events.map((event, index) => {
            const date = new Date(event.date);
            const title = event.displayTitle ?? event.title;
            return (
              <li key={event.id}>
                <AnimateIn delay={index * 0.06} className="mx-fiesta">
                  <time dateTime={event.date} className="mx-fiesta__flag">
                    <span className="mx-fiesta__day">{format(date, { day: "2-digit" })}</span>
                    <span className="mx-fiesta__month">{format(date, { month: "short" })}</span>
                  </time>
                  <div className="mx-fiesta__body">
                    <h3 className="mx-fiesta__title">{title}</h3>
                    <p className="mx-fiesta__time">
                      {format(date, { weekday: "long" })} · {format(date, { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="mx-fiesta__excerpt">{event.excerpt}</p>
                  </div>
                  <div className="mx-fiesta__action">
                    <Button href="#reservation" native variant="secondary" ariaLabel={t("fiestasBook", { title })}>
                      {t("fiestasBookShort")}
                    </Button>
                  </div>
                </AnimateIn>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

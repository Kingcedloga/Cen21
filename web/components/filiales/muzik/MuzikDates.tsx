import { getTranslations } from "next-intl/server";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";
import { ArrowUpRight } from "@/lib/icons";
import type { EventItem } from "@/lib/types";

import "@/styles/muzik.css";

/**
 * Les prochaines dates, comme la page « tournée » d'un groupe, sur aplat
 * rouge : jour et mois en grand, l'heure, le nom de la soirée et le lieu,
 * puis « Réserver » (formulaire de la fiche). Lien vers l'agenda filtré sur
 * la maison. Rien si aucune date.
 */
export async function MuzikDates({ events, locale, slug }: { events: EventItem[]; locale: Locale; slug: string }) {
  const t = await getTranslations("muzik");
  if (events.length === 0) return null;
  const intl = locale === "fr" ? "fr-FR" : "en-GB";
  const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(intl, options).format(date).replace(/\./g, "");

  return (
    <section aria-labelledby="muzik-dates-title" data-surface="dark" className="muzik-dates">
      <div className="muzik-dates__inner">
        <header className="muzik-dates__head">
          <div>
            <p className="muzik-eyebrow">{t("datesEyebrow")}</p>
            <h2 id="muzik-dates-title" className="muzik-title">
              {t("datesTitle")}
            </h2>
          </div>
          <Button href={`/evenements?maison=${slug}`} variant="secondary">
            {t("datesAll")}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </header>

        <ol className="muzik-dates__list">
          {events.map((event, index) => {
            const date = new Date(event.date);
            const title = event.displayTitle ?? event.title;
            return (
              <li key={event.id}>
                <AnimateIn delay={index * 0.06} className="muzik-date">
                  <time dateTime={event.date} className="muzik-date__when">
                    <span className="muzik-date__day">{format(date, { day: "2-digit" })}</span>
                    <span className="muzik-date__month">{format(date, { month: "short" })}</span>
                  </time>
                  <p className="muzik-date__time">
                    {format(date, { weekday: "long" })} · {format(date, { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <div className="muzik-date__body">
                    <h3 className="muzik-date__title">{title}</h3>
                    <p className="muzik-date__excerpt">{event.excerpt}</p>
                  </div>
                  <div className="muzik-date__action">
                    <Button href="#reservation" native variant="secondary" ariaLabel={t("datesBook", { title })}>
                      {t("datesBookShort")}
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

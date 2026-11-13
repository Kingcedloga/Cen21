import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";
import { ArrowUpRight } from "@/lib/icons";
import type { EventItem } from "@/lib/types";

import "@/styles/moka.css";

/**
 * Les rendez-vous de la maison en agenda typographique : pour chaque
 * événement, le jour en grand chiffre rouge, le mois et l'heure, le titre et
 * l'accroche, la photo dans une arche, et « Réserver » (formulaire de la
 * fiche). Lien vers l'agenda filtré sur la maison. Rien si aucun événement.
 */
export async function MokaAgenda({ events, locale, slug }: { events: EventItem[]; locale: Locale; slug: string }) {
  const t = await getTranslations("moka");
  if (events.length === 0) return null;
  const intl = locale === "fr" ? "fr-FR" : "en-GB";
  const format = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(intl, options).format(date);

  return (
    <div className="moka-agenda">
      <header className="moka-agenda__head">
        <div>
          <p className="moka-eyebrow">{t("agendaEyebrow")}</p>
          <h2 id="moka-agenda-title" className="moka-title">
            {t("agendaTitle")}
          </h2>
        </div>
        <Button href={`/evenements?maison=${slug}`} variant="secondary">
          {t("agendaAll")}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Button>
      </header>

      <ol className="moka-agenda__list">
        {events.map((event, index) => {
          const date = new Date(event.date);
          const title = event.displayTitle ?? event.title;
          return (
            <li key={event.id}>
              <AnimateIn delay={index * 0.06} className="moka-agenda__item">
                <time dateTime={event.date} className="moka-agenda__date">
                  <span className="moka-agenda__day">{format(date, { day: "2-digit" })}</span>
                  <span className="moka-agenda__month">{format(date, { month: "long" })}</span>
                  <span className="moka-agenda__time">
                    {format(date, { weekday: "long" })} · {format(date, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </time>
                <div className="moka-agenda__body">
                  <h3 className="moka-agenda__title">{title}</h3>
                  <p className="moka-agenda__excerpt">{event.excerpt}</p>
                  <p className="moka-agenda__place">{event.location}</p>
                </div>
                {event.image && (
                  <div className="moka-agenda__arch">
                    <Image src={event.image} alt="" fill sizes="(min-width: 1024px) 12rem, 30vw" className="object-cover" />
                  </div>
                )}
                <div className="moka-agenda__action">
                  <Button href="#reservation" native variant="secondary" ariaLabel={t("agendaBook", { title })}>
                    {t("agendaBookShort")}
                  </Button>
                </div>
              </AnimateIn>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

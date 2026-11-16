import { getTranslations } from "next-intl/server";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/routing";
import { ArrowUpRight } from "@/lib/icons";
import type { EventItem } from "@/lib/types";

import "@/styles/olive.css";

/** « Tous les jours 11h–02h » → ["11h", "02h"] ; « Daily 11am–2am » → ["11am", "2am"]. */
function openingTimes(hours?: string): [string, string] | null {
  if (!hours) return null;
  const [from, to] = hours.split(/[–—-]/);
  if (!from || !to) return null;
  return [from.trim().split(/\s+/).pop() ?? from.trim(), to.trim()];
}

/**
 * Jour de match (le bar sportif) : un tableau d'affichage de stade, olive
 * profond — l'ouverture et la fermeture en grands chiffres, les plaques des
 * atouts de la maison (écrans géants, piscine, karaoké…), puis la prochaine
 * rencontre de l'agenda et « Réserver ma table ».
 */
export async function OliveMatch({
  hours,
  next,
  locale,
  slug,
}: {
  hours?: string;
  next?: EventItem;
  locale: Locale;
  slug: string;
}) {
  const t = await getTranslations("olive");
  const board = t.raw("board") as string[];
  const times = openingTimes(hours);
  const intl = locale === "fr" ? "fr-FR" : "en-GB";
  const date = next ? new Date(next.date) : null;
  const format = (options: Intl.DateTimeFormatOptions) => (date ? new Intl.DateTimeFormat(intl, options).format(date) : "");

  return (
    <section aria-labelledby="olive-match-title" data-surface="light" className="olive-match">
      <div className="olive-match__inner">
        <header className="olive-match__head">
          <p className="olive-eyebrow">{t("matchEyebrow")}</p>
          <h2 id="olive-match-title" className="olive-title">
            {t("matchTitle")}
          </h2>
        </header>

        {times && (
          <AnimateIn className="olive-board">
            <div className="olive-board__cell">
              <span className="olive-board__label">{t("matchOpen")}</span>
              <span className="olive-board__digits">{times[0]}</span>
            </div>
            <span aria-hidden="true" className="olive-board__colon">
              :
            </span>
            <div className="olive-board__cell">
              <span className="olive-board__label">{t("matchClose")}</span>
              <span className="olive-board__digits">{times[1]}</span>
            </div>
          </AnimateIn>
        )}

        <ul className="olive-plates">
          {board.map((item, index) => (
            <li key={item}>
              <AnimateIn delay={index * 0.05} className="olive-plate">
                <span aria-hidden="true" className="olive-plate__num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item}
              </AnimateIn>
            </li>
          ))}
        </ul>

        <div className="olive-fixture">
          <p className="olive-fixture__label">{t("matchNext")}</p>
          {next && date ? (
            <div className="olive-fixture__body">
              <time dateTime={next.date} className="olive-fixture__date">
                <span>{format({ weekday: "long", day: "numeric", month: "long" })}</span>
                <span className="olive-fixture__time">{format({ hour: "2-digit", minute: "2-digit" })}</span>
              </time>
              <div>
                <h3 className="olive-fixture__title">{next.displayTitle ?? next.title}</h3>
                <p className="olive-fixture__excerpt">{next.excerpt}</p>
              </div>
              <div className="olive-fixture__actions">
                <Button href="#reservation" native>
                  {t("matchBook")}
                </Button>
                <Button href={`/evenements?maison=${slug}`} variant="secondary">
                  {t("matchAll")}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="olive-fixture__excerpt">{t("matchNone")}</p>
          )}
        </div>
      </div>
    </section>
  );
}

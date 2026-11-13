"use client";

import { useTranslations } from "next-intl";

import { FilialeOpenStatus } from "@/components/filiales/blocks/FilialeOpenStatus";
import { reveal } from "@/components/motion/Reveal";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { defaultScrollViewport, EASE } from "@/lib/motion";
import { ArrowUpRight } from "@/lib/icons";
import type { Subsidiary } from "@/lib/types";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/club.css";

type Rule = { id: string; answer: string; question: string };

/**
 * « Avant de venir » : les infos pratiques sur un ticket d'entrée (talon
 * « Admission », perforation, code-barres décoratif) et, à côté, les règles
 * de la maison (la FAQ, numérotée). Le ticket se pose en pivotant à son
 * entrée, la perforation se trace, les règles suivent en cascade.
 * Reduced motion : tout est en place.
 */
export function ClubTicket({ subsidiary, locale, mapsUrl, rules }: { subsidiary: Subsidiary; locale: string; mapsUrl: string; rules: Rule[] }) {
  const t = useTranslations("club");
  const tFiliale = useTranslations("filiale");
  const tCommon = useTranslations("common");
  const reduced = useReducedMotionSafe();
  const { address, hours, phone } = subsidiary.practicalInfo;
  const inView = reduced ? {} : { initial: "hidden" as const, whileInView: "shown" as const, viewport: defaultScrollViewport };

  return (
    <div className="club-entry">
      <header className="club-entry__head">
        <p className="club-eyebrow">{t("ticketEyebrow")}</p>
        <h2 id="club-entry-title" className="club-entry__title">
          {t("ticketTitle")}
        </h2>
      </header>

      <div className="club-entry__grid">
        <reveal.article
          className="club-ticket"
          aria-label={`${t("ticketAdmit")} — ${subsidiary.name}`}
          {...inView}
          variants={{ hidden: { opacity: 0, y: 60, rotate: -5 }, shown: { opacity: 1, y: 0, rotate: 0 } }}
          transition={{ duration: 0.9, ease: EASE.luxury }}
        >
          <div className="club-ticket__stub" aria-hidden="true">
            <span>{t("ticketAdmit")}</span>
            <span className="club-ticket__barcode" />
          </div>
          <reveal.span
            aria-hidden="true"
            className="club-ticket__perforation"
            {...inView}
            variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1 } }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE.luxury }}
          />
          <div className="club-ticket__main">
            <div className="club-ticket__top">
              <p className="club-ticket__name">{subsidiary.name}</p>
              <p className="club-ticket__valid">{t("ticketTonight")}</p>
            </div>
            {hours && <FilialeOpenStatus hours={hours} locale={locale} />}
            <dl className="club-ticket__facts">
              {address && (
                <div>
                  <dt>{tFiliale("addressTitle")}</dt>
                  <dd>
                    {address}
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="club-ticket__link">
                      {tCommon("directions")}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              )}
              {hours && (
                <div>
                  <dt>{tFiliale("hoursTitle")}</dt>
                  <dd>{hours}</dd>
                </div>
              )}
              {phone && (
                <div>
                  <dt>{tFiliale("phoneTitle")}</dt>
                  <dd>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="club-ticket__phone">
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <SocialLinks social={subsidiary.social} className="club-ticket__social" />
          </div>
        </reveal.article>

        {rules.length > 0 && (
          <div className="club-rules">
            <h3 className="club-rules__title">{t("rulesTitle")}</h3>
            <ol className="club-rules__list">
              {rules.map((rule, index) => (
                <reveal.li
                  key={rule.id}
                  className="club-rules__item"
                  {...inView}
                  variants={{ hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.7, delay: 0.15 + index * 0.12, ease: EASE.luxury }}
                >
                  <span aria-hidden="true" className="club-rules__num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="club-rules__name">{t.has(`rule-${rule.id}`) ? t(`rule-${rule.id}`) : rule.question}</h4>
                    <p>{rule.answer}</p>
                  </div>
                </reveal.li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

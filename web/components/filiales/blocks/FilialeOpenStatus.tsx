"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { openingStatus } from "@/lib/opening-status";
import { useHydrated } from "@/lib/use-media-query";

import "@/styles/filiale-blocks.css";

function weekday(locale: string, index: number) {
  // 1er janvier 2024 : un lundi (index 0).
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(new Date(2024, 0, 1 + index));
}

/**
 * État d'ouverture à l'heure de Kinshasa (« Ouvert · ferme à 02h »), mis à
 * jour chaque minute. Avant l'hydratation (heure inconnue côté serveur), le
 * résumé des horaires s'affiche.
 */
export function FilialeOpenStatus({ hours, locale }: { hours: string; locale: string }) {
  const t = useTranslations("filiale");
  const hydrated = useHydrated();
  const [, tick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => tick((value) => value + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const status = hydrated ? openingStatus(hours, locale) : null;
  let text = hours;
  if (status?.open) text = t("statusOpen", { time: status.time });
  else if (status && status.inDays === 0) text = t("statusOpensToday", { time: status.time });
  else if (status && status.inDays === 1) text = t("statusOpensTomorrow", { time: status.time });
  else if (status) text = t("statusOpensOn", { time: status.time, day: weekday(locale, status.day) });

  return (
    <span className="filiale-status" data-state={status ? (status.open ? "open" : "closed") : undefined}>
      <span aria-hidden="true" className="filiale-status__dot" />
      <span aria-live="polite">{text}</span>
    </span>
  );
}

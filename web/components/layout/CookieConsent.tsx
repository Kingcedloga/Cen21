"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";

/**
 * Mesure d'audience Google Analytics 4, soumise au consentement (RGPD / CNIL).
 *
 * - Aucun script Google n'est chargé tant que le visiteur n'a pas accepté.
 * - « Refuser » et « Accepter » ont le même poids visuel.
 * - Le choix est gardé dans localStorage ; le lien du pied de page
 *   (openCookieSettings) rouvre la bannière pour le modifier.
 * - Uniquement en production : pas de visites de développement dans GA.
 */
const STORAGE_KEY = "cen21-analytics-consent";
const OPEN_EVENT = "cen21:open-cookie-settings";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-9LY508WSGW";

type Choice = "granted" | "denied";

function readChoice(): Choice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function writeChoice(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* stockage indisponible (navigation privée) : le choix vaut pour la page */
  }
}

/** Rouvre la bannière (lien « Gérer mes cookies » du pied de page). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieConsent() {
  const t = useTranslations("common.consent");
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  // Lecture après le montage : le HTML statique est identique pour tous.
  useEffect(() => {
    const stored = readChoice();
    setChoice(stored);
    setOpen(stored === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const decide = useCallback((next: Choice) => {
    writeChoice(next);
    setChoice(next);
    setOpen(false);
  }, []);

  const enabled = process.env.NODE_ENV === "production" && Boolean(GA_ID);

  return (
    <>
      {enabled && choice === "granted" ? <GoogleAnalytics gaId={GA_ID} /> : null}
      {open ? (
        <div
          role="dialog"
          aria-live="polite"
          aria-labelledby="cookie-consent-title"
          className="fixed inset-x-3 bottom-3 z-[250] max-w-md rounded-2xl border border-ivory/15 bg-petrol-panel-3/95 p-5 text-ivory shadow-2xl shadow-black/50 backdrop-blur-md sm:inset-x-auto sm:bottom-5 sm:left-5"
        >
          <p id="cookie-consent-title" className="text-sm font-semibold">
            {t("title")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ivory/75">
            {t("body")}{" "}
            <Link href="/cookies" className="underline underline-offset-4 hover:text-rose">
              {t("policy")}
            </Link>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="cursor-pointer rounded-full border border-ivory/30 px-4 py-2.5 text-sm font-medium transition-colors hover:border-rose hover:text-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
            >
              {t("refuse")}
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="cursor-pointer rounded-full border border-ivory/30 px-4 py-2.5 text-sm font-medium transition-colors hover:border-rose hover:text-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

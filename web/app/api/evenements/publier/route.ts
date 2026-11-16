import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import subsidiariesEn from "@/content/en/subsidiaries.json";
import subsidiariesFr from "@/content/fr/subsidiaries.json";
import { EVENTS_TAG, eventsFromCsv } from "@/lib/events-sheet";
import type { Subsidiary } from "@/lib/types";

/**
 * « Publier maintenant » : relit la feuille d'agenda, renvoie un compte rendu
 * (événements lus, lignes ignorées et pourquoi) et vide le cache de l'agenda,
 * pour que la visite suivante affiche la feuille sans attendre les 10 min.
 *
 * GET /api/evenements/publier?cle=<EVENTS_PUBLISH_KEY>
 * Sans EVENTS_PUBLISH_KEY ou EVENTS_SHEET_CSV_URL configurées : 404.
 */
export const dynamic = "force-dynamic";

const sameKey = (given: string, expected: string) => {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

const text = (body: string, status = 200) =>
  new NextResponse(body, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });

export async function GET(request: Request) {
  const expected = process.env.EVENTS_PUBLISH_KEY?.trim();
  const url = process.env.EVENTS_SHEET_CSV_URL?.trim();
  if (!expected || !url) return text("Introuvable.", 404);

  const given = new URL(request.url).searchParams.get("cle") ?? "";
  if (!sameKey(given, expected)) return text("Clé invalide.", 403);

  let report: string;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`la feuille répond HTTP ${response.status}`);
    const csv = await response.text();
    if (/^\s*</.test(csv)) throw new Error("la feuille n'est pas publiée en CSV (Fichier → Partager → Publier sur le Web)");
    const { events, skipped } = eventsFromCsv(csv, {
      fr: subsidiariesFr.subsidiaries as Subsidiary[],
      en: subsidiariesEn.subsidiaries as Subsidiary[],
    });
    const upcoming = events.fr.filter((event) => new Date(event.date).getTime() >= Date.now()).length;
    report = [
      `Agenda publié : ${events.fr.length} événement(s) lu(s), dont ${upcoming} à venir.`,
      skipped.length ? `\nÀ corriger dans la feuille :\n- ${skipped.join("\n- ")}` : "\nAucune ligne ignorée.",
      "\nLe site affiche la nouvelle version à la prochaine visite (Google peut mettre jusqu'à 5 min à republier la feuille).",
    ].join("\n");
  } catch (error) {
    return text(`Agenda non publié : ${error instanceof Error ? error.message : error}.\nLe site garde la version précédente.`, 502);
  }

  // Expiration immédiate : la visite suivante relit la feuille.
  revalidateTag(EVENTS_TAG, { expire: 0 });
  return text(report);
}

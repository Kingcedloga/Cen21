/**
 * Agenda des maisons depuis une feuille Google Sheets (une ligne = un
 * événement, textes FR et EN côte à côte). La feuille est publiée en CSV
 * (Fichier → Partager → Publier sur le Web → CSV) ; son lien va dans la
 * variable d'environnement EVENTS_SHEET_CSV_URL. Mode d'emploi :
 * docs/evenements-google-sheets.md.
 *
 * Ce module ne fait que lire et valider : la récupération et le cache sont
 * dans lib/content.ts (getEvents).
 */

import type { Locale } from "@/i18n/routing";
import type { EventItem, EventStatus, Subsidiary } from "./types";

/** Tag du cache Next : revalidateTag(EVENTS_TAG) republie l'agenda. */
export const EVENTS_TAG = "events";

/** Hôtes d'images distants autorisés (repris par next.config.ts). */
export const REMOTE_IMAGE_HOSTS = ["images.unsplash.com", "img.youtube.com", "lh3.googleusercontent.com"];

/** Colonnes de la feuille (en-têtes sans accents ni majuscules) → champ. */
const COLUMNS = {
  publie: ["publie", "en_ligne", "visible"],
  maison: ["maison", "filiale"],
  date: ["date"],
  heure: ["heure"],
  titre_fr: ["titre_fr", "titre"],
  titre_en: ["titre_en"],
  titre_court: ["titre_court", "titre_affiche"],
  resume_fr: ["resume_fr", "resume", "description_fr"],
  resume_en: ["resume_en", "description_en"],
  lieu: ["lieu", "adresse"],
  image: ["image", "affiche", "photo"],
  statut: ["statut"],
  id: ["id"],
} as const;

type Field = keyof typeof COLUMNS;
type Row = Partial<Record<Field, string>>;

export type SheetResult = {
  events: Record<Locale, EventItem[]>;
  /** Lignes ignorées, avec la raison (ligne 2 = première ligne d'événement). */
  skipped: string[];
};

/** « Résumé FR » → « resume_fr ». */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const slugify = (value: string) => normalize(value).replace(/_/g, "-");

/** CSV (RFC 4180) : guillemets, virgules et retours à la ligne dans les cellules. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const source = text.replace(/^﻿/, "");
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && source[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((value) => value.trim()));
}

/** « 2026-08-15 », « 15/08/2026 » ou « 15/08/2026 19:30:00 » → [aaaa, mm, jj, heure?]. */
function parseDate(value: string): { day: string; time?: string } | null {
  const text = value.trim();
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2})[:h](\d{2}))?/);
  const fr = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})(?:\s+(\d{1,2})[:h](\d{2}))?/);
  const parts = iso
    ? { y: iso[1], m: iso[2], d: iso[3], hh: iso[4], mm: iso[5] }
    : fr
      ? { y: fr[3], m: fr[2], d: fr[1], hh: fr[4], mm: fr[5] }
      : null;
  if (!parts) return null;
  const month = Number(parts.m);
  const date = Number(parts.d);
  if (month < 1 || month > 12 || date < 1 || date > 31) return null;
  return {
    day: `${parts.y}-${parts.m.padStart(2, "0")}-${parts.d.padStart(2, "0")}`,
    time: parts.hh ? `${parts.hh.padStart(2, "0")}:${parts.mm}` : undefined,
  };
}

/** « 19:30 », « 19h30 », « 19:30:00 », « 19h » → « 19:30 ». */
function parseTime(value: string): string | null {
  const match = value.trim().match(/^(\d{1,2})\s*[:hH]\s*(\d{2})?/);
  if (!match || Number(match[1]) > 23) return null;
  return `${match[1].padStart(2, "0")}:${match[2] ?? "00"}`;
}

function parseStatus(value: string): EventStatus | undefined {
  const text = normalize(value);
  if (!text) return undefined;
  if (["complet", "sold_out", "soldout", "full"].includes(text)) return "sold-out";
  if (text === "vip") return "vip";
  return "upcoming";
}

const isOff = (value: string | undefined) => ["non", "no", "0", "false", "faux", "brouillon", "draft"].includes(normalize(value ?? ""));

/**
 * Lien d'image de la feuille → chemin utilisable par next/image :
 * - chemin du site (« /events/affiche.jpg ») : tel quel ;
 * - lien de partage Google Drive (fichier « Tous les utilisateurs disposant
 *   du lien ») : converti en lien direct ;
 * - autre lien https d'un hôte autorisé : tel quel ;
 * - vide ou hôte inconnu : null (la photo de la maison prend le relais).
 */
export function resolveImage(value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  if (text.startsWith("/")) return text;
  const drive = text.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{10,})/);
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1]}`;
  try {
    const url = new URL(text);
    return url.protocol === "https:" && REMOTE_IMAGE_HOSTS.includes(url.hostname) ? text : null;
  } catch {
    return null;
  }
}

/** Lieu par défaut : « Maison, adresse — Kinshasa » (sans répéter la ville). */
function defaultLocation(house: Subsidiary) {
  const place = [house.name, house.practicalInfo?.address].filter(Boolean).join(", ");
  return /kinshasa/i.test(place) ? place : `${place} — Kinshasa`;
}

/** Feuille (CSV) → événements FR et EN. Lève une erreur si la colonne d'en-tête est inutilisable. */
export function eventsFromCsv(text: string, houses: Record<Locale, Subsidiary[]>): SheetResult {
  const [header, ...lines] = parseCsv(text);
  if (!header) throw new Error("feuille vide");
  const names = header.map(normalize);
  const indexOf = Object.fromEntries(
    (Object.keys(COLUMNS) as Field[]).map((field) => [field, names.findIndex((name) => (COLUMNS[field] as readonly string[]).includes(name))]),
  ) as Record<Field, number>;
  const missing = (["maison", "date", "titre_fr"] as Field[]).filter((field) => indexOf[field] < 0);
  if (missing.length) throw new Error(`colonnes manquantes : ${missing.join(", ")}`);

  // « Millionaire Club » ou « millionaire-club » → la maison.
  const findHouse = (value: string) => {
    const key = slugify(value);
    const index = houses.fr.findIndex((house) => house.slug === key || slugify(house.name) === key);
    return index >= 0 ? index : null;
  };

  const events: Record<Locale, EventItem[]> = { fr: [], en: [] };
  const skipped: string[] = [];
  const seen = new Set<string>();

  lines.forEach((cells, position) => {
    const line = position + 2;
    const row: Row = {};
    (Object.keys(COLUMNS) as Field[]).forEach((field) => {
      if (indexOf[field] >= 0) row[field] = (cells[indexOf[field]] ?? "").trim();
    });
    if (isOff(row.publie)) return;
    // Ligne préparée mais pas encore remplie : ignorée sans remarque.
    if (!row.titre_fr && !row.maison && !row.date) return;
    if (!row.titre_fr) return skipped.push(`ligne ${line} : titre_fr vide`);

    const houseIndex = row.maison ? findHouse(row.maison) : null;
    if (houseIndex === null) return skipped.push(`ligne ${line} : maison inconnue « ${row.maison ?? ""} »`);

    const date = parseDate(row.date ?? "");
    if (!date) return skipped.push(`ligne ${line} : date illisible « ${row.date ?? ""} »`);
    const time = (row.heure && parseTime(row.heure)) || date.time || "20:00";
    const when = `${date.day}T${time}:00`;

    let id = row.id || `${date.day}-${houses.fr[houseIndex].slug}-${slugify(row.titre_fr)}`.slice(0, 96);
    while (seen.has(id)) id += "-2";
    seen.add(id);

    const image = resolveImage(row.image ?? "");
    if (row.image && !image) skipped.push(`ligne ${line} : image non prise en charge, photo de la maison utilisée`);

    (["fr", "en"] as Locale[]).forEach((locale) => {
      const house = houses[locale][houseIndex] ?? houses.fr[houseIndex];
      const title = (locale === "en" && row.titre_en) || row.titre_fr!;
      events[locale].push({
        id,
        slug: `${slugify(title)}-${date.day}`,
        title,
        displayTitle: row.titre_court || undefined,
        date: when,
        location: row.lieu || defaultLocation(house),
        subsidiarySlug: house.slug,
        image: image ?? house.coverImage,
        excerpt: (locale === "en" && row.resume_en) || row.resume_fr || "",
        status: parseStatus(row.statut ?? ""),
      });
    });
  });

  return { events, skipped };
}

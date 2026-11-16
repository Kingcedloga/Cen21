import type { Locale } from "@/i18n/routing";

import { getSiteConfig, getSubsidiaryBySlug } from "./content";
import { galleryEntrySrc } from "./gallery-categories";
import { buildHoursSchedule } from "./subsidiary-hours";
import type { Sector, Subsidiary } from "./types";

/**
 * SEO des fiches filiales : titre (nom, type d'établissement, ville),
 * description tronquée proprement, image de partage propre à la maison et
 * données structurées schema.org (établissement local, horaires, adresse,
 * fil d'Ariane). Uniquement à partir du contenu existant
 * (content/{fr,en}/subsidiaries.json) : rien n'est inventé.
 */

/** Longueur visée d'une meta description (les moteurs coupent vers 155–160). */
const DESCRIPTION_MAX = 158;

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

/** Type schema.org selon le secteur (le lounge sert aussi à manger). */
const SCHEMA_TYPES: Record<Sector, string | string[]> = {
  restaurant: "Restaurant",
  bar: "BarOrPub",
  lounge: ["BarOrPub", "Restaurant"],
  nightclub: "NightClub",
  evenementiel: "EventVenue",
};

/** Préfixe d'URL d'une langue (anglais à la racine, `localePrefix: "as-needed"`). */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === "en") return path || "/";
  return path ? `/fr${path}` : "/fr";
}

/** Coupe au dernier mot entier avant `max` caractères, avec une ellipse. */
export function truncateDescription(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.—–-]+$/, "")}…`;
}

/** Villes de la maison : ses adresses s'il y en a plusieurs, sinon celle de l'adresse. */
export function filialeCities(subsidiary: Subsidiary): string[] {
  const locations = subsidiary.practicalInfo.locations ?? [];
  if (locations.length > 0) return [...new Set(locations.map((location) => location.city))];
  const address = subsidiary.practicalInfo.address ?? "";
  return [/lubumbashi/i.test(address) ? "Lubumbashi" : "Kinshasa"];
}

/** Image de partage : la photo propre à la maison, la plus représentative disponible. */
export function filialeShareImage(subsidiary: Subsidiary): string {
  const local = (src?: string) => (src && src.startsWith("/") ? src : undefined);
  const gallery = subsidiary.galleryImages.map(galleryEntrySrc);
  return (
    local(subsidiary.heroSection?.image) ??
    local(subsidiary.teaserVideo?.poster) ??
    local(subsidiary.heroVideo?.poster) ??
    local(subsidiary.coverImage) ??
    gallery.find((src) => src.startsWith("/")) ??
    subsidiary.coverImage
  );
}

/** « 12h–00h » ou « 11am–2am » → ["12:00", "00:00"]. */
function parseRange(range: string): [string, string] | null {
  const fr = range.match(/(\d{1,2})h(\d{2})?\s*[–-]\s*(\d{1,2})h(\d{2})?/i);
  if (fr) {
    const pad = (h: string, m?: string) => `${h.padStart(2, "0")}:${m ?? "00"}`;
    return [pad(fr[1], fr[2]), pad(fr[3], fr[4])];
  }
  const en = range.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (en) {
    const to24 = (h: string, m: string | undefined, half: string) => {
      let hour = Number(h) % 12;
      if (half.toLowerCase() === "pm") hour += 12;
      return `${String(hour).padStart(2, "0")}:${m ?? "00"}`;
    };
    return [to24(en[1], en[2], en[3]), to24(en[4], en[5], en[6])];
  }
  return null;
}

/** Horaires schema.org : jours ouverts regroupés par plage horaire. */
function openingHours(hours?: string) {
  if (!hours) return undefined;
  const { schedule } = buildHoursSchedule(hours, "fr");
  const specs = new Map<string, string[]>();
  for (const day of schedule) {
    if (day.closed) continue;
    const range = parseRange(day.range);
    if (!range) return undefined;
    const key = range.join("-");
    specs.set(key, [...(specs.get(key) ?? []), DAY_NAMES[day.index]]);
  }
  if (specs.size === 0) return undefined;
  return [...specs.entries()].map(([key, days]) => {
    const [opens, closes] = key.split("-");
    return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
  });
}

/** Lien absolu (les données structurées n'acceptent pas de chemins relatifs). */
const absolute = (origin: string, src: string) => (src.startsWith("http") ? src : `${origin}${src}`);

/**
 * Données structurées d'une fiche : un établissement par adresse (une
 * maison à deux villes = deux établissements, même nom) et le fil d'Ariane.
 */
export function filialeJsonLd({
  locale,
  subsidiary,
  origin,
  labels,
}: {
  locale: Locale;
  subsidiary: Subsidiary;
  origin: string;
  labels: { home: string; subsidiaries: string };
}) {
  const site = getSiteConfig(locale);
  // Les horaires sont lus dans le contenu français (format « 12h–00h »).
  const hours = (getSubsidiaryBySlug("fr", subsidiary.slug) ?? subsidiary).practicalInfo.hours;
  const pageUrl = `${origin}${localizedPath(locale, `/filiales/${subsidiary.slug}`)}`;
  const sameAs = [subsidiary.social.instagram, subsidiary.social.facebook, subsidiary.social.linkedin].filter(Boolean);
  const locations = subsidiary.practicalInfo.locations?.length
    ? subsidiary.practicalInfo.locations
    : [{ city: filialeCities(subsidiary)[0], address: subsidiary.practicalInfo.address ?? "", phone: subsidiary.practicalInfo.phone ?? "" }];

  const businesses = locations.map((location) => ({
    "@type": SCHEMA_TYPES[subsidiary.sector] ?? "LocalBusiness",
    "@id": `${pageUrl}#${locations.length > 1 ? location.city.toLowerCase() : "etablissement"}`,
    name: subsidiary.name,
    description: subsidiary.description,
    url: pageUrl,
    image: absolute(origin, filialeShareImage(subsidiary)),
    logo: subsidiary.brandLogo ? absolute(origin, subsidiary.brandLogo) : undefined,
    telephone: location.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressCountry: "CD",
    },
    openingHoursSpecification: openingHours(hours),
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    parentOrganization: { "@type": "Organization", name: site.name, url: `${origin}${localizedPath(locale, "")}` },
  }));

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: labels.home, item: `${origin}${localizedPath(locale, "")}` },
      { "@type": "ListItem", position: 2, name: labels.subsidiaries, item: `${origin}${localizedPath(locale, "/filiales")}` },
      { "@type": "ListItem", position: 3, name: subsidiary.name, item: pageUrl },
    ],
  };

  return { "@context": "https://schema.org", "@graph": [...businesses, breadcrumb] };
}

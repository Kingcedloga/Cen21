import { buildHoursSchedule } from "@/lib/subsidiary-hours";

/** Plage d'ouverture d'un résumé d'horaires (« 11h–02h », « 11am–2am »), en minutes. */
export type OpeningRange = { open: number; close: number; openLabel: string; closeLabel: string };

export function parseOpeningRange(summary: string): OpeningRange | null {
  const fr = /(\d{1,2})h(\d{2})?\s*[–-]\s*(\d{1,2})h(\d{2})?/i.exec(summary);
  if (fr) {
    return {
      open: Number(fr[1]) * 60 + Number(fr[2] ?? 0),
      close: Number(fr[3]) * 60 + Number(fr[4] ?? 0),
      openLabel: `${fr[1]}h${fr[2] ?? ""}`,
      closeLabel: `${fr[3]}h${fr[4] ?? ""}`,
    };
  }
  const en = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(summary);
  if (en) {
    const to24 = (h: string, period: string) => (Number(h) % 12) + (period.toLowerCase() === "pm" ? 12 : 0);
    return {
      open: to24(en[1], en[3]) * 60 + Number(en[2] ?? 0),
      close: to24(en[4], en[6]) * 60 + Number(en[5] ?? 0),
      openLabel: `${en[1]}${en[2] ? `:${en[2]}` : ""}${en[3].toLowerCase()}`,
      closeLabel: `${en[4]}${en[5] ? `:${en[5]}` : ""}${en[6].toLowerCase()}`,
    };
  }
  return null;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Jour (lundi = 0) et minute courants à Kinshasa, quel que soit le fuseau du visiteur. */
export function kinshasaNow(date = new Date()): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Kinshasa",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "0";
  return { day: Math.max(0, WEEKDAYS.indexOf(get("weekday"))), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpeningStatus =
  | { open: true; time: string }
  | { open: false; time: string; inDays: number; day: number };

/**
 * Ouvert maintenant ? Sinon, prochaine ouverture (aujourd'hui, demain ou un
 * autre jour). Les plages qui passent minuit (18h–06h) sont prises en compte.
 * `null` si le résumé d'horaires ne se lit pas.
 */
export function openingStatus(summary: string, locale: string, date = new Date()): OpeningStatus | null {
  const range = parseOpeningRange(summary);
  if (!range) return null;
  const openDays = new Set(buildHoursSchedule(summary, locale).schedule.filter((d) => !d.closed).map((d) => d.index));
  const { day, minutes } = kinshasaNow(date);
  const overnight = range.close <= range.open;
  const isOpenDay = (d: number) => openDays.has(((d % 7) + 7) % 7);

  const openNow = overnight
    ? (isOpenDay(day) && minutes >= range.open) || (isOpenDay(day - 1) && minutes < range.close)
    : isOpenDay(day) && minutes >= range.open && minutes < range.close;
  if (openNow) return { open: true, time: range.closeLabel };

  if (isOpenDay(day) && minutes < range.open) return { open: false, time: range.openLabel, inDays: 0, day };
  for (let inDays = 1; inDays <= 7; inDays += 1) {
    if (isOpenDay(day + inDays)) return { open: false, time: range.openLabel, inDays, day: (day + inDays) % 7 };
  }
  return null;
}

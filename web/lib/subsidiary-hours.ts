export type HoursDayEntry = {
  /** Lundi = 0 … Dimanche = 6 */
  index: number;
  label: string;
  range: string;
  closed?: boolean;
};

export type ParsedHours = {
  preview: string;
  rangeLabel: string | null;
  schedule: HoursDayEntry[];
};

const DAY_RANGE_PATTERNS: {
  re: RegExp;
  openDays: number[];
}[] = [
  { re: /^(tous les jours|daily)\s+/i, openDays: [0, 1, 2, 3, 4, 5, 6] },
  { re: /^(lun[\u2013\-–]ven|mon[\u2013\-–]fri)\s+/i, openDays: [0, 1, 2, 3, 4] },
  { re: /^(mar[\u2013\-–]dim|tue[\u2013\-–]sun)\s+/i, openDays: [1, 2, 3, 4, 5, 6] },
  { re: /^(mer[\u2013\-–]dim|wed[\u2013\-–]sun)\s+/i, openDays: [2, 3, 4, 5, 6] },
  { re: /^(jeu[\u2013\-–]dim|thu[\u2013\-–]sun)\s+/i, openDays: [3, 4, 5, 6] },
  { re: /^(ven[\u2013\-–]dim|fri[\u2013\-–]sun)\s+/i, openDays: [4, 5, 6] },
  { re: /^(sam[\u2013\-–]dim|sat[\u2013\-–]sun)\s+/i, openDays: [5, 6] },
];

/** Extrait la plage horaire (FR `11h–02h`, EN `11am–2am`, etc.). */
export function extractTimeRange(summary: string): string {
  const normalized = summary.trim();
  const match = normalized.match(
    /(\d{1,2}h[\u2013\-–]\d{1,2}h|\d{1,2}(?::\d{2})?\s*(?:am|pm)[\u2013\-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i,
  );
  if (match) return match[0].replace(/\s+/g, " ").trim();
  const parts = normalized.split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : normalized;
}

function weekdayLabel(locale: string, dayIndex: number): string {
  const monday = new Date(2024, 0, 1 + dayIndex);
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(monday);
}

export function todayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function extractRangeLabel(summary: string): string | null {
  const match = summary.trim().match(/^([A-Za-zÀ-ÿ]{3}[\u2013\-–][A-Za-zÀ-ÿ]{3})\s+/i);
  return match?.[1] ?? null;
}

function openDaysFromSummary(summary: string): { openDays: number[]; rangeLabel: string | null } {
  for (const { re, openDays } of DAY_RANGE_PATTERNS) {
    if (re.test(summary.trim())) {
      const rangeLabel = extractRangeLabel(summary);
      return { openDays, rangeLabel };
    }
  }
  return { openDays: [0, 1, 2, 3, 4, 5, 6], rangeLabel: null };
}

export function buildHoursSchedule(summary: string, locale: string): ParsedHours {
  const timeRange = extractTimeRange(summary);
  const { openDays, rangeLabel } = openDaysFromSummary(summary);
  const openSet = new Set(openDays);

  const schedule: HoursDayEntry[] = Array.from({ length: 7 }, (_, index) => ({
    index,
    label: weekdayLabel(locale, index),
    range: timeRange,
    closed: !openSet.has(index),
  }));

  const today = todayIndex();
  const todayEntry = schedule[today];
  const fallbackRange = schedule.find((d) => !d.closed)?.range ?? timeRange;

  let preview: string;
  if (!todayEntry.closed) {
    preview = `${todayEntry.label} · ${todayEntry.range}`;
  } else if (rangeLabel) {
    preview = `${rangeLabel} · ${fallbackRange}`;
  } else {
    preview = `${todayEntry.label} · ${todayEntry.range}`;
  }

  return { preview, rangeLabel, schedule };
}

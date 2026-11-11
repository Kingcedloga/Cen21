import { SUBSIDIARY_NAVBAR_THEMES } from "@/lib/navbar-theme";

/** Luminance relative (WCAG) d'une couleur #rrggbb. */
function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const c = parseInt(value.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * Couleur de fond « marque » d'une filiale, sur laquelle son logo (blanc) se
 * lit : le fond de sa charte (navbar-theme), sauf s'il est trop clair — on
 * prend alors sa couleur d'accent (ex. L'Olive Verte : crème → olive).
 */
export function brandSurface(slug: string, accentColor: string): string {
  const background = SUBSIDIARY_NAVBAR_THEMES[slug]?.background ?? accentColor;
  if (/^#[0-9a-f]{6}$/i.test(background) && luminance(background) <= 0.45) return background;
  return accentColor;
}

/* --- Cartes aux chartes des filiales (/filiales, phase 5) ------------------ */

export type Rgb = [number, number, number];

/** #rgb, #rrggbb, rgb() ou rgba() → canaux 0–255 et opacité. */
export function parseColor(color: string): { rgb: Rgb; alpha: number } | null {
  const value = color.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    return { rgb: [0, 2, 4].map((o) => parseInt(full.slice(o, o + 2), 16)) as Rgb, alpha: 1 };
  }
  const fn = /^rgba?\(([^)]+)\)$/i.exec(value)?.[1];
  if (!fn) return null;
  const parts = fn.split(/[\s,/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return { rgb: [parts[0], parts[1], parts[2]], alpha: parts[3] ?? 1 };
}

export function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Rapport de contraste WCAG d'une couleur (éventuellement translucide) sur un fond opaque. */
export function contrastRatio(foreground: string, background: string): number {
  const bg = parseColor(background);
  const fg = parseColor(foreground);
  if (!bg || !fg) return 1;
  const mixed = fg.rgb.map((c, i) => c * fg.alpha + bg.rgb[i] * (1 - fg.alpha)) as Rgb;
  const [light, dark] = [relativeLuminance(mixed), relativeLuminance(bg.rgb)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

/** Repli dans la palette Cen21 quand une couleur de charte n'est pas lisible. */
const READABLE_ON_LIGHT = { css: "var(--color-petrol-panel-4)", hex: "#091a1f" };
const READABLE_ON_DARK = { css: "var(--color-ivory)", hex: "#e7d1bf" };

export type BrandCardPalette = {
  background: string;
  /** Titres (≥ 3:1, grands caractères). */
  title: string;
  /** Texte courant (≥ 4,5:1). */
  body: string;
  /** Texte secondaire (≥ 4,5:1). */
  muted: string;
  /** Numéro, filets, contour du bouton (≥ 3:1). */
  accent: string;
  /** Pour la capsule de navigation, qui s'inverse selon le fond. */
  surface: "dark" | "light";
};

/**
 * Couleurs d'une carte aux couleurs d'une filiale : la charte de sa page
 * (subsidiary-themes), chaque couleur de texte vérifiée contre le fond et
 * remplacée par un repli de la palette Cen21 si elle n'est pas lisible
 * (ex. Pinkberry : blanc sur rose ; L'Olive Verte : texte olive sur crème).
 */
export function brandCardPalette(
  theme: { bg: string; text: string; textMuted: string; gold: string } | null,
  fallbackBackground: string,
): BrandCardPalette {
  const background = theme?.bg ?? fallbackBackground;
  const bg = parseColor(background);
  const light = bg ? relativeLuminance(bg.rgb) > 0.4 : false;
  const fallback = light ? READABLE_ON_LIGHT : READABLE_ON_DARK;
  const pick = (color: string | undefined, min: number, otherwise: string) =>
    color && contrastRatio(color, background) >= min ? color : otherwise;

  const title = pick(theme?.text, 3, fallback.css);
  const body = pick(theme?.text, 4.5, fallback.css);
  return {
    background,
    title,
    body,
    muted: pick(theme?.textMuted, 4.5, body),
    accent: pick(theme?.gold, 3, title),
    surface: light ? "light" : "dark",
  };
}

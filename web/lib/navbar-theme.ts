import type { CSSProperties } from "react";

/** Charte navbar par filiale (fond, textes/icônes, accent). */
export type SubsidiaryNavbarTheme = {
  background: string;
  foreground: string;
  accent: string;
};

/** Slug → charte navbar (aligné sur content/en|fr/subsidiaries.json). */
export const SUBSIDIARY_NAVBAR_THEMES: Record<string, SubsidiaryNavbarTheme> = {
  "filiale-01": {
    background: "#ECE7D1",
    foreground: "#767F34",
    accent: "#BA2525",
  },
  "filiale-02": {
    background: "#0b2F49",
    foreground: "#e1c676",
    accent: "#e1c676",
  },
  "filiale-03": {
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "filiale-04": {
    background: "#000000",
    foreground: "#C9A84C",
    accent: "#C9A84C",
  },
  "filiale-05": {
    background: "#0033A0",
    foreground: "#FFFFFF",
    accent: "#EF3340",
  },
  "filiale-06": {
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#CC0000",
  },
  "filiale-07": {
    background: "#006847",
    foreground: "#FFFFFF",
    accent: "#CE1126",
  },
  "filiale-08": {
    background: "#006B3F",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "filiale-09": {
    background: "#E8427C",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "filiale-10": {
    background: "#8B5E3C",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
};

const FILIALE_PATH = /^\/filiales\/([^/]+)/;

/** Extrait le slug filiale depuis le pathname next-intl (sans préfixe locale). */
export function getSubsidiarySlugFromPathname(pathname: string | null): string | null {
  if (!pathname) return null;
  const match = pathname.match(FILIALE_PATH);
  return match?.[1] ?? null;
}

/** Retourne la charte filiale si la route est une page détail filiale, sinon null. */
export function getSubsidiaryNavbarTheme(
  pathname: string | null,
): SubsidiaryNavbarTheme | null {
  const slug = getSubsidiarySlugFromPathname(pathname);
  if (!slug) return null;
  return SUBSIDIARY_NAVBAR_THEMES[slug] ?? null;
}

/** Variables CSS injectées sur le conteneur navbar en mode filiale. */
export function navbarThemeVars(
  theme: SubsidiaryNavbarTheme,
): Record<string, string> {
  return {
    "--nav-bg": theme.background,
    "--nav-fg": theme.foreground,
    "--nav-accent": theme.accent,
  };
}

/** Variables CSS injectées sur le footer en mode filiale (charte alignée navbar). */
export function footerThemeVars(
  theme: SubsidiaryNavbarTheme,
): Record<string, string> {
  return {
    "--footer-bg": theme.background,
    "--footer-fg": theme.foreground,
    "--footer-accent": theme.accent,
    "--footer-fg-muted": colorWithAlpha(theme.foreground, 0.72),
    "--footer-fg-subtle": colorWithAlpha(theme.foreground, 0.48),
    "--footer-border": colorWithAlpha(theme.foreground, 0.14),
    "--footer-border-accent": colorWithAlpha(theme.accent, 0.32),
    "--footer-btn-fg": theme.background,
    "--footer-logo-ring": colorWithAlpha(theme.accent, 0.42),
    "--footer-logo-bg": colorWithAlpha(theme.foreground, 0.06),
    "--footer-surface": colorWithAlpha(theme.foreground, 0.08),
  };
}

/** Motif décoratif footer — trait accent dynamique (SVG data URL). */
export function footerPatternStyle(accent: string): string {
  const stroke = accent.replace("#", "");
  return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' fill='none' stroke='%23${stroke}' stroke-width='0.35' opacity='0.45'/%3E%3C/svg%3E")`;
}

/** Couleur hex → rgba pour fond navbar progressif au scroll */
export function colorWithAlpha(color: string, alpha: number): string {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return color;
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function subsidiaryNavbarSurfaceStyle(
  theme: SubsidiaryNavbarTheme,
  reveal: number,
): CSSProperties {
  const p = Math.min(1, Math.max(0, reveal));
  const blur = p * 18;
  const saturate = 100 + p * 45;

  return {
    backgroundColor: colorWithAlpha(theme.background, p * 0.94),
    borderColor: colorWithAlpha(theme.foreground, p * 0.14),
    backdropFilter: p > 0.04 ? `blur(${blur}px) saturate(${saturate}%)` : "none",
    WebkitBackdropFilter:
      p > 0.04 ? `blur(${blur}px) saturate(${saturate}%)` : "none",
    boxShadow:
      p > 0.12
        ? `0 ${6 + p * 12}px ${20 + p * 20}px -${10 + p * 8}px rgba(0,0,0,${p * 0.52})`
        : "none",
  };
}

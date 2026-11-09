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

import { contrastRatio, parseColor, relativeLuminance, type Rgb } from "@/lib/subsidiary-brand";
import type { SubsidiaryPageTheme } from "@/lib/subsidiary-themes";

/**
 * Palette du groupe redéfinie aux couleurs d'une maison (refonte R5).
 *
 * Les composants du site lisent `var(--color-*)` (palette CEN21). Dans le
 * périmètre d'une fiche migrée, ces variables prennent les couleurs de la
 * charte de la maison : fond → `petrol-panel-4`, texte → `ivory`, accent →
 * `rose`, etc. Les composants des pages groupe (hero, formulaire, FAQ, arc,
 * pile d'événements…) s'y adaptent sans être réécrits.
 *
 * Polarité libre : une charte claire (fond crème, texte foncé) inverse
 * simplement fond et texte, le contraste reste le même.
 */

const toCss = ([r, g, b]: Rgb) => `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
const triple = ([r, g, b]: Rgb) => `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as Rgb;

/** Couleur (éventuellement translucide) posée sur un fond opaque. */
function opaque(color: string, background: Rgb): Rgb {
  const parsed = parseColor(color);
  if (!parsed) return background;
  return mix(background, parsed.rgb, parsed.alpha);
}

export type FilialeBrand = {
  /** Déclarations CSS à poser sur le périmètre de la fiche (ou sur <body>). */
  vars: Record<string, string>;
  /** Accent (texte), aplat des boutons et texte sur l'aplat, pour contrôle. */
  accent: string;
  fill: string;
  onAccent: string;
};

const BLACK: Rgb = [0, 0, 0];
const WHITE: Rgb = [255, 255, 255];
const ratio = (a: Rgb, b: Rgb) => contrastRatio(toCss(a), toCss(b));
const lighter = (a: Rgb, b: Rgb) => relativeLuminance(a) > relativeLuminance(b);

/**
 * Teinte (mélange vers le noir ou le blanc, à l'opposé de `against`) jusqu'au
 * contraste visé, au plus `max`. Rend `null` si le contraste n'est pas atteint.
 */
function shadeTo(color: Rgb, against: Rgb, target: number, max = 0.6): Rgb | null {
  const toward = lighter(against, color) ? BLACK : WHITE;
  for (let t = 0; t <= max + 1e-9; t += 0.02) {
    const shaded = mix(color, toward, t);
    if (ratio(shaded, against) >= target) return shaded;
  }
  return null;
}

/**
 * Carte Google en mode nuit (fiche de lieu) : clarté inversée, teintes
 * remises en place par la rotation, couleurs adoucies pour se fondre dans une
 * charte sombre. Charte claire : la carte reste telle quelle.
 */
const NIGHT_MAP_FILTER = "invert(0.9) hue-rotate(180deg) saturate(0.55) brightness(0.92) contrast(0.92)";

/** Contraste du texte courant (AAA : ses variantes à 70 % restent lisibles). */
const TEXT_CONTRAST = 7;
/** Texte d'accent (étiquettes, prix) et texte des boutons : AA. */
const AA = 4.5;

/** Typographie propre à la maison (passée par sa composition). */
export type FilialeBrandOptions = {
  /** Famille des titres (`.title-display`, `.title-section`), ex. `cormorant.style.fontFamily`. */
  titleFont?: string;
  titleWeight?: number;
  /** Interlettrage des titres d'affiche et de section (ex. `"-0.01em"`). */
  titleTracking?: { display: string; section: string };
};

export function filialeBrand(theme: SubsidiaryPageTheme, options: FilialeBrandOptions = {}): FilialeBrand {
  const { colors } = theme;
  const bg = opaque(colors.bg, BLACK);
  const bgCss = toCss(bg);
  const cardOf = (text: Rgb) => mix(bg, text, 0.06);

  // Texte : celui de la charte, assombri (charte claire) ou éclairci (charte
  // sombre) s'il n'atteint pas 7:1 sur les cartes.
  const charterText = opaque(colors.text, bg);
  let text = charterText;
  for (let t = 0; t <= 0.6 && ratio(text, cardOf(text)) < TEXT_CONTRAST; t += 0.02) {
    text = mix(charterText, lighter(bg, charterText) ? BLACK : WHITE, t);
  }
  const card = cardOf(text);

  const sources = [colors.gold, colors.btn, colors.red, colors.ochre]
    .filter((c): c is string => Boolean(c))
    .map((c) => opaque(c, bg))
    // « gold » vaut parfois le fond (charte claire) : ce n'est pas un accent.
    .filter((c) => ratio(c, bg) >= 1.5);

  // Accent en texte (--color-rose) : la première couleur de la charte lisible
  // sur les cartes (≥ 4,5:1), sinon la première, teintée (au plus 35 %),
  // sinon le texte.
  const accent =
    sources.find((c) => ratio(c, card) >= AA) ??
    (sources[0] && shadeTo(sources[0], card, AA, 0.35)) ??
    text;

  // Aplat des boutons et pastilles : la couleur des boutons de la charte ;
  // texte posé dessus = le fond ou le texte, le plus contrasté, et l'aplat
  // teinté au besoin pour atteindre 4,5:1.
  const fillSource = [colors.btn, colors.red, colors.gold]
    .filter((c): c is string => Boolean(c))
    .map((c) => opaque(c, bg))
    .find((c) => ratio(c, bg) >= 1.5) ?? accent;
  const onAccent = ratio(bg, fillSource) >= ratio(text, fillSource) ? bg : text;
  const fill = shadeTo(fillSource, onAccent, AA) ?? fillSource;
  // Dégradé du bouton : l'aplat et une teinte qui s'éloigne du texte posé
  // dessus (le contraste ne fait que croître le long du dégradé).
  const fillShade = mix(fill, lighter(onAccent, fill) ? BLACK : WHITE, 0.16);

  const lifted = mix(bg, text, 0.1);

  // Surface claire (sections claires) : celle de la charte, sinon le texte
  // (comme le Quartz des pages groupe). Le texte y est le pétrole relevé ;
  // l'accent foncé (rose-deep) y est assombri jusqu'à 4,5:1.
  const light = colors.light ? opaque(colors.light, bg) : text;
  const accentDeep = mix(accent, bg, 0.35);
  const accentDeepOnLight = shadeTo(accentDeep, light, AA) ?? accentDeep;

  const vars: Record<string, string> = {
    // Surfaces (pétrole profond = fond de la maison).
    "--color-petrol-panel-4": bgCss,
    "--color-petrol-panel-3": toCss(card),
    "--color-petrol-panel-2": toCss(mix(bg, text, 0.12)),
    "--color-petrol-panel-1": toCss(mix(bg, text, 0.08)),
    "--color-petrol": toCss(lifted),
    // Texte (Quartz = texte de la maison).
    "--color-neutral": toCss(text),
    "--color-neutral-rgb": triple(text),
    // Accent (Refined Rosé = accent de la maison) et dérivés.
    "--color-rose": toCss(accent),
    "--color-rose-rgb": triple(accent),
    "--color-rose-light": toCss(mix(accent, text, 0.45)),
    "--color-rose-mid": toCss(mix(accent, bg, 0.15)),
    "--color-rose-deep": toCss(accentDeepOnLight),
    // Aplats (boutons, onglet actif, pastilles) et leur texte.
    "--brand-fill": toCss(fill),
    "--brand-fill-rgb": triple(fill),
    "--brand-on-accent": toCss(onAccent),
    // Bouton principal (dégradé qui glisse au survol, globals.css) : l'aplat
    // et sa teinte seulement.
    "--brand-button": `linear-gradient(100deg,${toCss(fillShade)} 0%,${toCss(fill)} 40%,${toCss(fillShade)} 72%,${toCss(fill)} 100%)`,
    // Spectre de révélation des titres (SpectrumText) : texte → accent.
    "--spectrum-stops": [text, mix(text, accent, 0.5), accent, accentDeep].map(triple).join(", "),
    "--surface-light": toCss(light),
    "--brand-map-filter": lighter(text, bg) ? NIGHT_MAP_FILTER : "none",
  };
  if (options.titleFont) vars["--brand-title-font"] = options.titleFont;
  if (options.titleWeight) vars["--font-weight-display"] = String(options.titleWeight);
  if (options.titleTracking) {
    vars["--letter-spacing-display"] = options.titleTracking.display;
    vars["--letter-spacing-section"] = options.titleTracking.section;
  }

  return { vars, accent: toCss(accent), fill: toCss(fill), onAccent: toCss(onAccent) };
}

/**
 * Jetons dérivés : une variable qui en référence une autre est résolue là où
 * elle est déclarée (:root). On les redéclare dans le périmètre de la maison
 * pour qu'ils suivent la palette redéfinie (mêmes formules que globals.css).
 */
const DERIVED = [
  "--color-ivory:var(--color-neutral)",
  "--color-anthracite:var(--color-petrol-panel-4)",
  "--color-taupe:color-mix(in srgb,var(--color-neutral) 72%,var(--color-petrol))",
  "--color-stone:color-mix(in srgb,var(--color-neutral) 52%,var(--color-petrol-panel-3))",
  "--background:var(--color-petrol-panel-4)",
  "--foreground:var(--color-neutral)",
  "--surface-dark:var(--color-petrol-panel-4)",
  "--gradient-rose:linear-gradient(100deg,var(--color-rose-deep) 0%,var(--color-rose-light) 45%,var(--color-rose) 100%)",
  "--sweep-on-dark:linear-gradient(90deg,var(--color-neutral) 0 33%,var(--color-rose) 43%,var(--color-rose-light) 51%,var(--color-rose) 59%,var(--color-neutral) 70% 100%)",
  "--sweep-on-light:linear-gradient(90deg,var(--color-petrol) 0 33%,var(--color-rose-deep) 44%,var(--color-rose-mid) 52%,var(--color-rose-deep) 60%,var(--color-petrol) 72% 100%)",
  "--sweep-rose:linear-gradient(90deg,var(--color-rose) 0%,var(--color-rose-light) 13%,var(--color-rose) 26%,var(--color-neutral) 44%,var(--color-rose-light) 52%,var(--color-neutral) 58%,var(--color-rose-deep) 74%,var(--color-rose-light) 87%,var(--color-rose) 100%)",
];

/** Bloc CSS à poser sur un sélecteur (ex. `body`) : toute la page prend la charte. */
export function filialeBrandCss(selector: string, brand: FilialeBrand): string {
  const declarations = [...Object.entries(brand.vars).map(([name, value]) => `${name}:${value}`), ...DERIVED].join(";");
  return `${selector}{${declarations}}`;
}

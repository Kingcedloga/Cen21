import { filialeBrand, filialeBrandCss, type FilialeBrandOptions } from "@/lib/filiale-brand";
import type { SubsidiaryPageTheme } from "@/lib/subsidiary-themes";

/**
 * Palette de la maison posée sur toute la page (<body>) : blocs, capsule de
 * navigation, footer et barre haute prennent la charte de la filiale. Rendue
 * par la fiche (et le labo) ; disparaît avec la page à la navigation.
 * `options` : typographie propre à la maison (police des titres…).
 */
export function FilialeBrandStyle({ theme, options }: { theme: SubsidiaryPageTheme; options?: FilialeBrandOptions }) {
  return <style dangerouslySetInnerHTML={{ __html: filialeBrandCss("body", filialeBrand(theme, options)) }} />;
}

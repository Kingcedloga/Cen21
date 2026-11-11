import { filialeBrand, filialeBrandCss } from "@/lib/filiale-brand";
import type { SubsidiaryPageTheme } from "@/lib/subsidiary-themes";

/**
 * Palette de la maison posée sur toute la page (<body>) : blocs, capsule de
 * navigation, footer et barre haute prennent la charte de la filiale. Rendue
 * par la fiche (et le labo) ; disparaît avec la page à la navigation.
 */
export function FilialeBrandStyle({ theme }: { theme: SubsidiaryPageTheme }) {
  return <style dangerouslySetInnerHTML={{ __html: filialeBrandCss("body", filialeBrand(theme)) }} />;
}

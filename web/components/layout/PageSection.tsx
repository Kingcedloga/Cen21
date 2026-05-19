import type { ReactNode } from "react";

type Variant = "default" | "alt" | "dark";
type Spacing = "default" | "compact" | "loose";

const variantBg: Record<Variant, string> = {
  default: "bg-petrol",
  alt: "bg-petrol-panel-2/40",
  dark: "bg-petrol-panel-4",
};

const spacingClass: Record<Spacing, string> = {
  compact: "py-16 md:py-20",
  default: "py-20 md:py-28",
  loose: "py-24 md:py-32",
};

/**
 * Section wrapper avec marges horizontales et verticales uniformes.
 * Utiliser systématiquement pour les blocs de contenu afin de garder
 * la même grille sur toutes les pages.
 */
export function PageSection({
  children,
  variant = "default",
  spacing = "default",
  containerClassName = "max-w-7xl mx-auto",
  className = "",
  id,
  ariaLabelledby,
  overflow = "visible",
}: {
  children: ReactNode;
  variant?: Variant;
  spacing?: Spacing;
  containerClassName?: string;
  className?: string;
  id?: string;
  ariaLabelledby?: string;
  overflow?: "visible" | "hidden";
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`relative ${overflow === "hidden" ? "overflow-hidden" : "overflow-visible"} px-4 md:px-6 lg:px-8 ${spacingClass[spacing]} ${variantBg[variant]} ${className}`}
    >
      <div className={containerClassName}>{children}</div>
    </section>
  );
}

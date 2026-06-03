type Props = {
  className?: string;
};

/** Grille de petits points décoratifs (angles de l’image — style club premium). */
export function PresentationDotOrnaments({ className }: Props) {
  return (
    <span
      className={["presentation-dot-ornament", className].filter(Boolean).join(" ")}
      aria-hidden
    />
  );
}

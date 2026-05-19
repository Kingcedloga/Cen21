/** Transition visuelle entre sections (même principe que le footer). */
export type SectionWaveFill = "petrol" | "anthracite" | "band" | "ivory";

const fillClasses: Record<SectionWaveFill, string> = {
  petrol: "text-petrol",
  anthracite: "text-anthracite",
  band: "text-[color:var(--wave-band)]",
  ivory: "text-ivory",
};

type Props = {
  /** Couleur sous la ligne de vague (= début du bloc suivant). */
  fill?: SectionWaveFill;
  /** Retournement vertical pour alterner les formes selon les enchaînements. */
  flip?: boolean;
  className?: string;
};

export function SectionWave({ fill = "petrol", flip = false, className = "" }: Props) {
  const fillClass = fillClasses[fill];

  return (
    <div
      className={`pointer-events-none relative -mt-px w-full leading-none ${fillClass} ${className}`}
    >
      <div className={flip ? "origin-center [transform:scaleY(-1)]" : ""}>
        <svg
          className="relative block h-10 w-full md:h-14"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,40 C180,80 360,0 540,35 C720,70 900,10 1080,40 C1260,70 1320,20 1440,45 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </div>
  );
}

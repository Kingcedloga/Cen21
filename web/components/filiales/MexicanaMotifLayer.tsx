/**
 * Motifs décoratifs Gourmet Mexicana — Aztèque / Maya stylisés, premium & discrets.
 * Rendu fixe, sans interaction ; masqué si prefers-reduced-motion (via CSS parent).
 */
export function MexicanaMotifLayer() {
  return (
    <div
      aria-hidden
      className="mexicana-motif-layer pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Grille géométrique — fret aztèque */}
      <svg
        className="mexicana-motif-layer__grid absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="mx-fret"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 24h12v-12h12V0M48 24H36v12H24v12"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.55"
            />
            <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.35" />
          </pattern>
          <pattern
            id="mx-diamond-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M16 4 L28 16 L16 28 L4 16 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.45"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mx-fret)" opacity="0.038" />
        <rect width="100%" height="100%" fill="url(#mx-diamond-grid)" opacity="0.022" />
      </svg>

      {/* Ornement coin supérieur droit — cadre géométrique */}
      <svg
        viewBox="0 0 120 120"
        className="mexicana-motif-layer__corner-tr absolute -right-2 top-20 hidden h-28 w-28 sm:block md:top-28 md:h-32 md:w-32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M120 0H88v8H32V0H0v32h8v56H0v32h32v-8h56v8h32V88h-8V32h8V0Z"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <path
          className="mexicana-motif-layer__accent-red"
          d="M88 32h-24v24h24V32Z"
          stroke="currentColor"
          strokeWidth="0.6"
        />
        <path d="M76 44h8v8h-8v-8Z" fill="currentColor" opacity="0.5" />
      </svg>

      {/* Ornement coin inférieur gauche */}
      <svg
        viewBox="0 0 120 120"
        className="mexicana-motif-layer__corner-bl absolute -left-2 bottom-24 hidden h-32 w-32 rotate-180 sm:block md:bottom-32 md:h-36 md:w-36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M120 0H96v12H24V0H0v24h12v72H0v24h24v-12h72v12h24V96h-12V24h12V0Z"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <path
          className="mexicana-motif-layer__accent-ochre"
          d="M24 24h48v48H24V24Z"
          stroke="currentColor"
          strokeWidth="0.55"
        />
      </svg>

      {/* Bande latérale — motif escalier Maya (desktop) */}
      <svg
        viewBox="0 0 24 160"
        className="mexicana-motif-layer__side absolute right-3 top-1/2 hidden -translate-y-1/2 lg:block xl:right-6"
        width="24"
        height="160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 0v20h8v20h-8v20h8v20h-8v20h8v20h-8v20"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          className="mexicana-motif-layer__accent-red"
          d="M4 40h6M4 80h6M4 120h6"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>

      {/* Texture artisanale — grain subtil */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-soft-light"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="mx-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#mx-grain)" />
      </svg>
    </div>
  );
}

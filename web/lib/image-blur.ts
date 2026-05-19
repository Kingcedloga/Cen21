/**
 * Placeholder uniformément sombre (proche du fond petrol Cen21) pour
 * `<Image placeholder="blur">` quand l'import statique n'est pas possible
 * (chemins string vers /public, images distantes).
 */
const blurSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
  <defs>
    <radialGradient id='g' cx='50%' cy='38%' r='75%'>
      <stop offset='0%' stop-color='#0C272E'/>
      <stop offset='100%' stop-color='#004258'/>
    </radialGradient>
  </defs>
  <rect width='16' height='16' fill='url(#g)'/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const BLUR_PETROL = `data:image/svg+xml;base64,${toBase64(blurSvg)}`;

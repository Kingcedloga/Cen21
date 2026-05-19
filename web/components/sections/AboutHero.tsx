import Image from "next/image";

import { SectionWave } from "@/components/layout/SectionWave";
import { BLUR_PETROL } from "@/lib/image-blur";

/**
 * Hero éditorial pour la page À propos : image immersive en background,
 * triple voile petrol pour profondeur cinématique, texte premium au premier plan.
 */
export function AboutHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
}) {
  return (
    <>
      <section
        aria-labelledby="about-hero-title"
        className="relative isolate overflow-hidden bg-petrol pt-32 pb-24 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32"
      >
        {/* Photo de fond — qualité ultra haute, blur placeholder pour zéro CLS */}
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR_PETROL}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Voile sombre éditorial (pétrole bas, fade vers haut) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/85 to-petrol/35"
        />
        {/* Halo doré radial subtil pour profondeur premium */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(197,160,89,0.18)_0%,transparent_55%)]"
        />
        {/* Voile noir bas pour contraste maximal sous le bloc texte */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {eyebrow && (
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-9 bg-gradient-to-r from-transparent to-gold/85"
              />
              <span
                aria-hidden
                className="inline-flex h-1.5 w-1.5 rotate-45 bg-gold/85 shadow-[0_0_10px_rgba(197,160,89,0.55)]"
              />
              <p className="text-gold text-[11px] font-semibold tracking-[0.32em] uppercase">
                {eyebrow}
              </p>
            </div>
          )}
          <h1
            id="about-hero-title"
            className="mb-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-ivory [text-shadow:0_2px_28px_rgba(0,0,0,0.5)] md:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-base leading-[1.65] text-ivory/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] md:text-lg">
              {description}
            </p>
          )}
        </div>
      </section>
      <SectionWave fill="petrol" />
    </>
  );
}

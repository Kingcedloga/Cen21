import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { getSiteConfig } from "@/lib/content";

const site = getSiteConfig();

export function HeroCinematic() {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      <Image
        src={site.heroImage}
        alt="Ambiance premium Cen21 Hospitality"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/70 to-petrol/30" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-28 pt-36 md:pt-40">
        <div className="max-w-4xl space-y-5 md:space-y-7">
          <p className="text-gold text-sm tracking-[0.25em] uppercase">
            Holding lifestyle premium
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl lg:text-8xl font-light text-ivory leading-[1.05]">
            {site.tagline}
          </h1>
          <p className="text-taupe text-lg md:text-xl max-w-2xl leading-relaxed pt-1">
            {site.description}
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 pt-3 md:pt-5">
            <Button href="/filiales">Découvrir nos filiales</Button>
            <Button href="/contact" variant="secondary">
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

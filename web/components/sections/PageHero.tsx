import { SectionWave } from "@/components/layout/SectionWave";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <>
      <section className="bg-petrol px-4 pb-16 pt-36 md:px-6 md:pb-20 md:pt-40 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {eyebrow && (
            <div className="mb-5 flex flex-col gap-3 items-start">
              <p className="text-gold text-[11px] font-medium tracking-[0.28em] uppercase">
                {eyebrow}
              </p>
              <span
                className="h-px w-12 bg-gradient-to-r from-gold/85 to-gold/20"
                aria-hidden
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-ivory font-light mb-5 tracking-[-0.02em] leading-[1.08] max-w-4xl">
            {title}
          </h1>
          {description && (
            <p className="text-taupe text-base md:text-lg max-w-2xl leading-[1.65]">
              {description}
            </p>
          )}
        </div>
      </section>
      <SectionWave fill="petrol" />
    </>
  );
}

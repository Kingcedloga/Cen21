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
    <section className="pt-32 pb-16 px-4 md:px-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {eyebrow && (
          <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl text-ivory font-light mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-taupe text-lg max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function CtaBand() {
  return (
    <section className="py-24 px-4 md:px-6">
      <AnimateIn>
        <div className="max-w-7xl mx-auto glass-panel rounded-2xl p-10 md:p-16 text-center">
          <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4">
            Expériences sur mesure
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-5xl text-ivory mb-6">
            Prêt à vivre l&apos;exception ?
          </h2>
          <p className="text-taupe max-w-xl mx-auto mb-8">
            Explorez nos adresses, nos événements à venir ou contactez-nous pour
            une expérience privée.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/evenements">Voir les événements</Button>
            <Button href="/contact" variant="secondary">
              Prendre contact
            </Button>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}

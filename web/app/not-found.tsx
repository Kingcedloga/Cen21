import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-28 text-center">
      <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">Erreur 404</p>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light text-ivory md:text-6xl">
        Page introuvable
      </h1>
      <p className="mt-6 max-w-md text-taupe">
        Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil ou explorez nos
        filiales.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button href="/">Accueil</Button>
        <Button href="/filiales" variant="secondary">
          Nos filiales
        </Button>
      </div>
    </section>
  );
}

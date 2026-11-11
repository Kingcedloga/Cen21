import { getTranslations } from "next-intl/server";

import { ContactForm, type ContactHouse } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Réservation sur la fiche (ancre `#reservation`) : le formulaire de /contact,
 * maison fixée, besoins limités à ce qui se réserve. Même envoi
 * (/api/contact), même préremplissage par l'adresse.
 */
export async function FilialeReservation({ slug, name, houses }: { slug: string; name: string; houses: ContactHouse[] }) {
  const t = await getTranslations("filiale");
  return (
    <div id="reservation" className="contact-card scroll-mt-6" data-surface="dark">
      <div>
        <SectionHeading
          look="editorial"
          eyebrow={t("reservationEyebrow")}
          title={t("reservationTitle", { name })}
          sweep={name}
          description={t("reservationText")}
          titleAs="h2"
          titleId="filiale-reservation-title"
          align="left"
          className="mb-0!"
        />
      </div>
      <div className="contact-card__form">
        <ContactForm houses={houses} fixedHouse={slug} needs={["reservation", "privatisation", "entreprise", "autre"]} />
      </div>
    </div>
  );
}

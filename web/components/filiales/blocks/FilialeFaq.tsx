import { getTranslations } from "next-intl/server";

import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Questions fréquentes de la maison (content/{fr,en}/faq.json), accordéon de /contact. */
export async function FilialeFaq({ name, items }: { name: string; items: { id: string; question: string; answer: string }[] }) {
  const t = await getTranslations("filiale");
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:sticky lg:top-24 lg:col-span-5">
        <SectionHeading
          look="editorial"
          eyebrow={t("faqEyebrow")}
          title={t("faqTitle", { name })}
          sweep={name}
          titleAs="h2"
          titleId="filiale-faq-title"
          align="left"
          className="mb-0!"
        />
      </div>
      <div className="lg:col-span-7">
        <FaqAccordion items={items.map((item) => ({ id: item.id, question: item.question, answer: <p>{item.answer}</p> }))} />
      </div>
    </div>
  );
}

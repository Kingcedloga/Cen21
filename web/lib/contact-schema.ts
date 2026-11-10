import { z } from "zod";

/** Besoins proposés en pastilles sur /contact (valeurs aussi lues dans `?besoin=`). */
export const CONTACT_NEEDS = [
  "reservation",
  "privatisation",
  "entreprise",
  "partenariat",
  "presse",
  "autre",
] as const;

export type ContactNeed = (typeof CONTACT_NEEDS)[number];

/** Besoins qui appellent une date et un nombre de personnes. */
export const DATED_NEEDS: readonly ContactNeed[] = ["reservation", "privatisation"];

/** Valeur de la pastille « Le groupe » (`?maison=groupe`). */
export const CONTACT_GROUP = "groupe";

export function isContactNeed(value: string | null | undefined): value is ContactNeed {
  return Boolean(value) && (CONTACT_NEEDS as readonly string[]).includes(value as string);
}

export function getContactSchema(messages: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return z.object({
    name: z.string().min(2, messages.name),
    email: z.string().email(messages.email),
    phone: z.string().optional(),
    subject: z.string().min(3, messages.subject),
    message: z.string().min(10, messages.message),
    // Formulaire de /contact : champs structurés, transmis tels quels au webhook.
    need: z.string().optional(),
    house: z.string().optional(),
    date: z.string().optional(),
    guests: z.string().optional(),
    website: z.string().optional(),
  });
}

export type ContactFormData = z.infer<ReturnType<typeof getContactSchema>>;

/**
 * Formulaire de /contact : pas de champ « sujet », il est composé à l'envoi
 * à partir du besoin et de la maison choisis.
 */
export function getContactFormSchema(messages: { name: string; email: string; message: string }) {
  return getContactSchema({ ...messages, subject: "" }).omit({ subject: true });
}

export type ContactFormValues = z.infer<ReturnType<typeof getContactFormSchema>>;

/** Server-side validation (API route) — English messages by default. */
export const contactSchema = getContactSchema({
  name: "Name required (minimum 2 characters)",
  email: "Invalid email",
  subject: "Subject required",
  message: "Message required (minimum 10 characters)",
});

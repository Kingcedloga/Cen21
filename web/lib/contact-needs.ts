/**
 * Constantes et types du formulaire de contact, sans zod : importés par le
 * composant client (ContactForm), ils n'embarquent pas la bibliothèque de
 * validation (63 Ko gzip), réservée à l'API (lib/contact-schema.ts).
 */

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

/** Valeurs du formulaire de /contact (pas de champ « sujet » : composé à l'envoi). */
export type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  need?: string;
  house?: string;
  date?: string;
  guests?: string;
  website?: string;
};

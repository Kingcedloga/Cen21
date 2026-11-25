import { z } from "zod";

export {
  CONTACT_GROUP,
  CONTACT_NEEDS,
  DATED_NEEDS,
  isContactNeed,
  type ContactFormValues,
  type ContactNeed,
} from "./contact-needs";

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


/** Server-side validation (API route) — English messages by default. */
export const contactSchema = getContactSchema({
  name: "Name required (minimum 2 characters)",
  email: "Invalid email",
  subject: "Subject required",
  message: "Message required (minimum 10 characters)",
});

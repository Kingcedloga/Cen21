import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nom requis (2 caractères minimum)"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(3, "Sujet requis"),
  message: z.string().min(10, "Message requis (10 caractères minimum)"),
  website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

"use client";

import { useCallback, useState } from "react";

export type ReservationToastState =
  | { variant: "success"; title: string; message?: string }
  | { variant: "error"; title: string; message?: string }
  | null;

type Messages = {
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
};

/**
 * Soumission réelle des formulaires de réservation "bespoke" (un par filiale)
 * vers /api/contact — sans dupliquer le fetch/toast dans chaque composant.
 * Les champs additionnels (personnes, date, heure…) sont concaténés dans
 * `message` puisque l'API de contact n'a pas de schéma dédié aux réservations.
 */
export function useReservationForm(subjectLabel: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ReservationToastState>(null);

  const submit = useCallback(
    async (form: HTMLFormElement, messages: Messages) => {
      const data = new FormData(form);

      // Honeypot anti-spam — si rempli, on abandonne silencieusement.
      if (String(data.get("website") ?? "").trim()) return;

      const name = String(data.get("name") ?? "").trim();
      const email = String(data.get("email") ?? "").trim();
      const phone = String(data.get("phone") ?? "").trim();

      const extraEntries: string[] = [];
      data.forEach((value, key) => {
        if (["name", "email", "phone", "website"].includes(key)) return;
        const v = String(value).trim();
        if (v) extraEntries.push(`${key}: ${v}`);
      });

      setIsSubmitting(true);
      setToast(null);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone: phone || undefined,
            subject: subjectLabel,
            message: [subjectLabel, ...extraEntries].join(" · "),
            website: "",
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(typeof json.error === "string" ? json.error : messages.errorBody);
        }
        setToast({ variant: "success", title: messages.successTitle, message: messages.successBody });
        form.reset();
      } catch (e) {
        setToast({
          variant: "error",
          title: messages.errorTitle,
          message: e instanceof Error ? e.message : messages.errorBody,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [subjectLabel],
  );

  return { isSubmitting, toast, setToast, submit };
}

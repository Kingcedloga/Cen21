"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Erreur lors de l'envoi");
      }
      setStatus("success");
      reset();
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <Field label="Nom" error={errors.name?.message}>
        <input
          id="name"
          className={inputClass}
          {...register("name")}
          autoComplete="name"
        />
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          className={inputClass}
          {...register("email")}
          autoComplete="email"
        />
      </Field>

      <Field label="Sujet" error={errors.subject?.message}>
        <input id="subject" className={inputClass} {...register("subject")} />
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          id="message"
          rows={5}
          className={`${inputClass} resize-y min-h-[120px]`}
          {...register("message")}
        />
      </Field>

      {status === "success" && (
        <p className="text-gold text-sm" role="status">
          Merci — votre message a bien été envoyé.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm" role="alert">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}

const inputClass =
  "w-full bg-anthracite/80 border border-white/15 px-4 py-3 text-ivory placeholder:text-stone focus:border-gold transition-colors duration-200";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={label.toLowerCase()} className="block text-sm text-taupe mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

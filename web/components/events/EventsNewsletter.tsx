"use client";

import { useId, useRef, useState, type FormEvent } from "react";

export type NewsletterLabels = {
  subscribeText: string;
  emailPlaceholder: string;
  subscribeCta: string;
  subscribing: string;
  subscribeSuccess: string;
  subscribeError: string;
};

/**
 * Inscription à l'agenda (champ e-mail en pilule). Envoi à /api/contact
 * avec un sujet dédié : la liste est tenue côté webhook.
 */
export function EventsNewsletter({ labels, className = "" }: { labels: NewsletterLabels; className?: string }) {
  const inputId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = emailRef.current?.value.trim();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter",
          email,
          subject: "Newsletter — Événements",
          message: "Nouvelle inscription à la newsletter événements.",
          website: "",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className={`max-w-md ${className}`}>
      <p className="text-sm font-medium text-ivory/80">{labels.subscribeText}</p>
      <form
        onSubmit={onSubmit}
        className="mt-3 flex items-center rounded-full border border-rose/35 bg-petrol-panel-3/70 p-1.5 focus-within:border-rose/70"
      >
        <label htmlFor={inputId} className="sr-only">
          {labels.emailPlaceholder}
        </label>
        <input
          ref={emailRef}
          id={inputId}
          type="email"
          required
          autoComplete="email"
          placeholder={labels.emailPlaceholder}
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/50 focus:outline-none sm:text-base"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          // Pilule dans la pilule : `.btn-primary` ne fixe pas d'arrondi.
          className="btn-primary min-h-11 shrink-0 cursor-pointer rounded-full px-5 text-xs font-bold uppercase tracking-wider disabled:opacity-70"
        >
          {status === "loading" ? labels.subscribing : labels.subscribeCta}
        </button>
      </form>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-rose">
        {status === "success" ? labels.subscribeSuccess : status === "error" ? labels.subscribeError : ""}
      </p>
    </div>
  );
}

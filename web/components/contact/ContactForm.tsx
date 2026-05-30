"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Toast, ToastViewport } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { getContactSchema, type ContactFormData } from "@/lib/contact-schema";
import {
  fadeUpTransition,
  fadeUpVariants,
  staggerContainerVariants,
} from "@/lib/motion";

type ToastState =
  | { variant: "success"; title: string; message?: string }
  | { variant: "error"; title: string; message?: string }
  | null;

export function ContactForm() {
  const t = useTranslations("form");
  const schema = useMemo(
    () =>
      getContactSchema({
        name: t("errors.name"),
        email: t("errors.email"),
        subject: t("errors.subject"),
        message: t("errors.message"),
      }),
    [t],
  );

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [toast, setToast] = useState<ToastState>(null);
  const reduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: { website: "" },
  });

  const loading = isSubmitting || status === "loading";

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setToast(null);
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
      setToast({
        variant: "success",
        title: t("successTitle"),
        message: t("successBody"),
      });
      reset();
    } catch (e) {
      setStatus("error");
      setToast({
        variant: "error",
        title: t("errorTitle"),
        message: e instanceof Error ? e.message : t("errorBody"),
      });
    }
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        variants={reduced ? undefined : staggerContainerVariants}
      >
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">{t("honeypot")}</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <motion.div variants={reduced ? undefined : fadeUpVariants} transition={fadeUpTransition}>
          <Field label={t("name")} inputId="name" error={errors.name?.message}>
            <input
              id="name"
              className={inputClass}
              {...register("name")}
              autoComplete="name"
              aria-invalid={!!errors.name || undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </Field>
        </motion.div>

        <motion.div variants={reduced ? undefined : fadeUpVariants} transition={fadeUpTransition}>
          <Field label={t("email")} inputId="email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              className={inputClass}
              {...register("email")}
              autoComplete="email"
              aria-invalid={!!errors.email || undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </Field>
        </motion.div>

        <motion.div variants={reduced ? undefined : fadeUpVariants} transition={fadeUpTransition}>
          <Field label={t("subject")} inputId="subject" error={errors.subject?.message}>
            <input
              id="subject"
              className={inputClass}
              {...register("subject")}
              aria-invalid={!!errors.subject || undefined}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
          </Field>
        </motion.div>

        <motion.div variants={reduced ? undefined : fadeUpVariants} transition={fadeUpTransition}>
          <Field label={t("message")} inputId="message" error={errors.message?.message}>
            <textarea
              id="message"
              rows={5}
              className={`${inputClass} resize-y min-h-[120px]`}
              {...register("message")}
              aria-invalid={!!errors.message || undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
          </Field>
        </motion.div>

        <motion.div variants={reduced ? undefined : fadeUpVariants} transition={fadeUpTransition}>
          <Button type="submit" disabled={loading} ariaLabel={loading ? t("submitting") : undefined}>
            {loading && <SubmitSpinner />}
            {loading ? t("submitting") : t("submit")}
          </Button>
        </motion.div>
      </motion.form>

      <ToastViewport>
        {toast && (
          <Toast
            key={`${toast.variant}-${toast.title}`}
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </ToastViewport>
    </>
  );
}

const inputClass =
  "w-full rounded-lg bg-anthracite/70 border border-white/12 px-4 py-3 text-ivory text-[15px] placeholder:text-stone/90 outline-none ring-0 transition-all duration-fine focus:border-gold/50 focus:ring-2 focus:ring-gold/20 aria-[invalid=true]:border-red-400/50 aria-[invalid=true]:focus:ring-red-400/20";

function SubmitSpinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-petrol/25 border-t-petrol"
    />
  );
}

function Field({
  label,
  inputId,
  error,
  children,
}: {
  label: string;
  inputId: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[11px] font-medium uppercase tracking-[0.14em] text-gold/85 mb-2"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${inputId}-error`} className="text-red-400 text-xs mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

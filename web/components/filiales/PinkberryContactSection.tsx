"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { IconFacebook, IconInstagram, IconLinkedin } from "@/components/ui/SocialLinks";
import { Toast, ToastViewport } from "@/components/ui/Toast";
import { getContactSchema, type ContactFormData } from "@/lib/contact-schema";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { SocialLinks as SocialLinksType, SubsidiaryContactSection } from "@/lib/types";

import "@/styles/pinkberry-contact-section.css";

type ToastState =
  | { variant: "success"; title: string; message?: string }
  | { variant: "error"; title: string; message?: string }
  | null;

export function PinkberryContactSection({
  content,
  hours,
  address,
  phone,
  email,
  social,
  decorImages,
}: {
  content: SubsidiaryContactSection;
  hours?: string;
  address?: string;
  phone?: string;
  email: string;
  social: SocialLinksType;
  decorImages: string[];
}) {
  const reduced = useReducedMotion();
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

  const [toast, setToast] = useState<ToastState>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: { website: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setToast(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur lors de l'envoi");
      setToast({ variant: "success", title: t("successTitle"), message: t("successBody") });
      reset();
    } catch (e) {
      setToast({
        variant: "error",
        title: t("errorTitle"),
        message: e instanceof Error ? e.message : t("errorBody"),
      });
    }
  };

  const socialLinks = [
    { href: social.instagram, Icon: IconInstagram, name: "Instagram" },
    { href: social.facebook, Icon: IconFacebook, name: "Facebook" },
    { href: social.linkedin, Icon: IconLinkedin, name: "LinkedIn" },
  ].filter((l): l is { href: string; Icon: typeof IconInstagram; name: string } =>
    Boolean(l.href),
  );

  const cardMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: defaultScrollViewport,
          transition: { duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.08 },
        };

  return (
    <section className="pinkberry-contact" aria-labelledby="pinkberry-contact-title">
      {decorImages.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`pinkberry-contact__decor pinkberry-contact__decor--${i + 1}`}
          initial={reduced ? false : { opacity: 0, scale: 0.95 }}
          whileInView={reduced ? undefined : { opacity: 0.9, scale: 1 }}
          viewport={defaultScrollViewport}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: i * 0.1 }}
        />
      ))}

      <AnimateIn className="pinkberry-contact__header">
        <p className="pinkberry-contact__eyebrow">{content.eyebrow}</p>
        <h2 id="pinkberry-contact-title" className="pinkberry-contact__title">
          {content.title}
        </h2>
      </AnimateIn>

      <div className="pinkberry-contact__grid">
        <motion.div className="pinkberry-contact__card" {...cardMotion(0)}>
          <div className="pinkberry-contact__block">
            <h3 className="pinkberry-contact__block-title">{content.hoursTitle}</h3>
            {hours && <p className="pinkberry-contact__line">{hours}</p>}
          </div>

          <div className="pinkberry-contact__block">
            <h3 className="pinkberry-contact__block-title">{content.contactInfoTitle}</h3>
            {address && <p className="pinkberry-contact__line">{address}</p>}
            <p className="pinkberry-contact__line">{email}</p>
            {phone && <p className="pinkberry-contact__line">{phone}</p>}
          </div>

          {socialLinks.length > 0 && (
            <div className="pinkberry-contact__block">
              <h3 className="pinkberry-contact__block-title">{content.socialTitle}</h3>
              <div className="pinkberry-contact__social-row">
                {socialLinks.map(({ href, Icon, name }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="pinkberry-contact__social-btn"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div className="pinkberry-contact__card" {...cardMotion(1)}>
          <h3 className="pinkberry-contact__form-title">{content.formTitle}</h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="pinkberry-website">{t("honeypot")}</label>
              <input
                id="pinkberry-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div className="pinkberry-contact__form-row">
              <div className="pinkberry-contact__field">
                <input
                  id="pinkberry-name"
                  className="pinkberry-contact__input"
                  placeholder={content.namePlaceholder}
                  aria-label={t("name")}
                  {...register("name")}
                  autoComplete="name"
                  aria-invalid={!!errors.name || undefined}
                />
                {errors.name && (
                  <p className="pinkberry-contact__error" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="pinkberry-contact__field">
                <input
                  id="pinkberry-email"
                  type="email"
                  className="pinkberry-contact__input"
                  placeholder={content.emailPlaceholder}
                  aria-label={t("email")}
                  {...register("email")}
                  autoComplete="email"
                  aria-invalid={!!errors.email || undefined}
                />
                {errors.email && (
                  <p className="pinkberry-contact__error" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pinkberry-contact__form-row">
              <div className="pinkberry-contact__field">
                <input
                  id="pinkberry-phone"
                  type="tel"
                  className="pinkberry-contact__input"
                  placeholder={content.phonePlaceholder}
                  aria-label={t("phone")}
                  {...register("phone")}
                  autoComplete="tel"
                />
              </div>
              <div className="pinkberry-contact__field">
                <input
                  id="pinkberry-subject"
                  className="pinkberry-contact__input"
                  placeholder={content.subjectPlaceholder}
                  aria-label={t("subject")}
                  {...register("subject")}
                  aria-invalid={!!errors.subject || undefined}
                />
                {errors.subject && (
                  <p className="pinkberry-contact__error" role="alert">
                    {errors.subject.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pinkberry-contact__field">
              <textarea
                id="pinkberry-message"
                rows={5}
                className="pinkberry-contact__input pinkberry-contact__textarea"
                placeholder={content.messagePlaceholder}
                aria-label={t("message")}
                {...register("message")}
                aria-invalid={!!errors.message || undefined}
              />
              {errors.message && (
                <p className="pinkberry-contact__error" role="alert">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button type="submit" className="pinkberry-contact__submit" disabled={isSubmitting}>
              {isSubmitting && <span className="pinkberry-contact__spinner" aria-hidden="true" />}
              {isSubmitting ? t("submitting") : content.submitLabel}
            </button>
          </form>
        </motion.div>
      </div>

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
    </section>
  );
}

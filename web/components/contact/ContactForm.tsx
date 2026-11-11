"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Toast, ToastViewport } from "@/components/ui/Toast";
import {
  CONTACT_GROUP,
  CONTACT_NEEDS,
  DATED_NEEDS,
  getContactFormSchema,
  isContactNeed,
  type ContactFormValues,
} from "@/lib/contact-schema";

import "@/styles/contact-extras.css";

export type ContactHouse = {
  slug: string;
  name: string;
  logo?: string;
  logoSurface: string;
};

type ToastState = { variant: "success" | "error"; title: string; message?: string } | null;

/** Maison reconnue (`groupe` ou un slug de la liste), sinon chaîne vide. */
function knownHouse(value: string | null | undefined, houses: ContactHouse[]): string {
  return value === CONTACT_GROUP || houses.some((house) => house.slug === value) ? (value as string) : "";
}

/**
 * Formulaire de /contact (refonte R1, d'après la carte de prise de rendez-vous
 * d'Orbix) : pastilles de besoin et de maison, puis les coordonnées.
 * Réservation ou privatisation : la date et le nombre de personnes apparaissent.
 *
 * Préremplissage :
 * - par l'adresse : `/contact?besoin=privatisation&maison=filiale-02#contact-form` ;
 * - sur la page : un lien `<a href="#contact-form" data-contact-need="…"
 *   data-contact-house="…">` coche les pastilles avant le défilement.
 *
 * Envoi à /api/contact : sujet composé (besoin — maison), détails en tête du
 * message, champs structurés transmis au webhook.
 */
export function ContactForm({ houses }: { houses: ContactHouse[] }) {
  const t = useTranslations("form");
  const params = useSearchParams();

  const besoin = params.get("besoin");
  const paramNeed = isContactNeed(besoin) ? besoin : "";
  const paramHouse = knownHouse(params.get("maison"), houses);

  const schema = useMemo(
    () =>
      getContactFormSchema({
        name: t("errors.name"),
        email: t("errors.email"),
        message: t("errors.message"),
      }),
    [t],
  );

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [toast, setToast] = useState<ToastState>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { need: paramNeed, house: paramHouse, website: "" },
  });

  const need = useWatch({ control, name: "need" });
  const dated = isContactNeed(need) && DATED_NEEDS.includes(need);
  const loading = isSubmitting || status === "loading";

  // L'adresse change sans recharger la page (lien vers `?besoin=…`).
  useEffect(() => {
    if (paramNeed) setValue("need", paramNeed);
    if (paramHouse) setValue("house", paramHouse);
  }, [paramNeed, paramHouse, setValue]);

  // Liens de la page qui préremplissent le formulaire avant d'y défiler.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-contact-need], [data-contact-house]") : null;
      if (!link) return;
      const linkNeed = link.dataset.contactNeed;
      const linkHouse = knownHouse(link.dataset.contactHouse, houses);
      if (isContactNeed(linkNeed)) setValue("need", linkNeed);
      if (linkHouse) setValue("house", linkHouse);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [houses, setValue]);

  const houseName = (slug?: string) =>
    slug === CONTACT_GROUP ? t("houseGroup") : houses.find((house) => house.slug === slug)?.name;

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("loading");
    setToast(null);

    const needLabel = isContactNeed(data.need) ? t(`needs.${data.need}`) : t("defaultSubject");
    const house = houseName(data.house);
    const withDate = isContactNeed(data.need) && DATED_NEEDS.includes(data.need);
    const details = [
      house && t("detailLine", { label: t("houseLegend"), value: house }),
      withDate && data.date && t("detailLine", { label: t("date"), value: data.date }),
      withDate && data.guests && t("detailLine", { label: t("guests"), value: data.guests }),
    ].filter(Boolean);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone?.trim() || undefined,
          subject: [needLabel, house].filter(Boolean).join(" — "),
          message: details.length ? `${details.join("\n")}\n\n${data.message}` : data.message,
          need: data.need || undefined,
          house: data.house || undefined,
          date: withDate ? data.date || undefined : undefined,
          guests: withDate ? data.guests || undefined : undefined,
          website: data.website,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: unknown };
      if (!res.ok) throw new Error(typeof json.error === "string" ? json.error : t("errorBody"));
      setStatus("success");
      setToast({ variant: "success", title: t("successTitle"), message: t("successBody") });
      reset({ need: "", house: "", name: "", email: "", phone: "", date: "", guests: "", message: "", website: "" });
    } catch (e) {
      setStatus("error");
      setToast({
        variant: "error",
        title: t("errorTitle"),
        message: e instanceof Error && e.message ? e.message : t("errorBody"),
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form" noValidate>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">{t("honeypot")}</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <fieldset className="contact-form__group">
          <legend className="contact-form__legend">
            {t("needLegend")} <span>({t("optional")})</span>
          </legend>
          <div className="contact-form__pills">
            {CONTACT_NEEDS.map((value) => (
              <label key={value} className="choice-pill tap-press">
                <input type="radio" value={value} className="choice-pill__input" {...register("need")} />
                <span>{t(`needs.${value}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Date et nombre de personnes : réservation et privatisation. */}
        <div className="contact-form__reveal" data-open={dated ? "" : undefined} inert={!dated}>
          <div className="contact-form__reveal-inner">
            <div className="grid gap-5 pt-1 sm:grid-cols-2">
              <Field label={t("date")} hint={t("optional")} inputId="contact-date">
                <input id="contact-date" type="date" className={INPUT} {...register("date")} />
              </Field>
              <Field label={t("guests")} hint={t("optional")} inputId="contact-guests">
                <input
                  id="contact-guests"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={999}
                  className={INPUT}
                  {...register("guests")}
                />
              </Field>
            </div>
          </div>
        </div>

        <fieldset className="contact-form__group">
          <legend className="contact-form__legend">
            {t("houseLegend")} <span>({t("optional")})</span>
          </legend>
          <div className="contact-form__pills">
            {[{ slug: CONTACT_GROUP, name: t("houseGroup"), logo: "/logo.png", logoSurface: "var(--color-petrol)" }, ...houses].map(
              (house) => (
                <label key={house.slug} className="choice-pill choice-pill--house tap-press">
                  <input type="radio" value={house.slug} className="choice-pill__input" {...register("house")} />
                  <span className="choice-pill__logo" style={{ backgroundColor: house.logoSurface }}>
                    {house.logo && <Image src={house.logo} alt="" fill sizes="24px" className="object-contain p-0.5" />}
                  </span>
                  <span>{house.name}</span>
                </label>
              ),
            )}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("name")} inputId="contact-name" error={errors.name?.message}>
            <input
              id="contact-name"
              className={INPUT}
              autoComplete="name"
              aria-invalid={!!errors.name || undefined}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              {...register("name")}
            />
          </Field>
          <Field label={t("email")} inputId="contact-email" error={errors.email?.message}>
            <input
              id="contact-email"
              type="email"
              className={INPUT}
              autoComplete="email"
              aria-invalid={!!errors.email || undefined}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              {...register("email")}
            />
          </Field>
          <Field label={t("phone")} hint={t("optional")} inputId="contact-phone">
            <input id="contact-phone" type="tel" className={INPUT} autoComplete="tel" {...register("phone")} />
          </Field>
        </div>

        <Field label={t("message")} inputId="contact-message" error={errors.message?.message}>
          <textarea
            id="contact-message"
            rows={5}
            className={`${INPUT} min-h-[8rem] resize-y`}
            aria-invalid={!!errors.message || undefined}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            {...register("message")}
          />
        </Field>

        <div>
          <Button type="submit" disabled={loading} ariaLabel={loading ? t("submitting") : undefined}>
            {loading && <SubmitSpinner />}
            {loading ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>

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

const INPUT =
  "w-full rounded-2xl border border-ivory/12 bg-petrol-panel-3/80 px-4 py-3 text-[15px] text-ivory outline-none transition-[border-color,box-shadow] duration-fine placeholder:text-stone/90 focus:border-rose/55 focus:ring-2 focus:ring-rose/20 aria-[invalid=true]:border-red-400/50 aria-[invalid=true]:focus:ring-red-400/20";

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
  hint,
  inputId,
  error,
  children,
}: {
  label: string;
  hint?: string;
  inputId: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={inputId} className="contact-form__label">
        {label}
        {hint && <span> ({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

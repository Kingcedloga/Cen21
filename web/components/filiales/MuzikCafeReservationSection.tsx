"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, type FormEvent } from "react";

import { useRouter } from "@/i18n/navigation";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Calendar, Clock, Mail, Phone, User, Users } from "@/lib/icons";
import { cormorant } from "@/lib/fonts";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/muzik-cafe-reservation.css";

type Props = {
  backgroundImage: string;
};

const FIELDS = [
  { key: "name", icon: User, type: "text" },
  { key: "phone", icon: Phone, type: "tel" },
  { key: "email", icon: Mail, type: "email" },
  { key: "people", icon: Users, type: "text" },
  { key: "date", icon: Calendar, type: "text" },
  { key: "time", icon: Clock, type: "text" },
] as const;

export function MuzikCafeReservationSection({ backgroundImage }: Props) {
  const t = useTranslations("subsidiaries");
  const router = useRouter();

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      router.push("/contact");
    },
    [router],
  );

  return (
    <section className={`muzik-reservation ${cormorant.variable}`}>
      <div
        className="muzik-reservation__media"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      >
        <span className="muzik-reservation__overlay" />
      </div>

      <div className="muzik-reservation__content">
        <AnimateIn>
          <h2 className="muzik-reservation__title">{t("muzikCafeReservation.title")}</h2>
        </AnimateIn>

        <form className="muzik-reservation__form" onSubmit={handleSubmit}>
          <div className="muzik-reservation__grid">
            {FIELDS.map((field, i) => {
              const Icon = field.icon;
              const label = t(`muzikCafeReservation.${field.key}`);
              return (
                <motion.div
                  key={field.key}
                  className="muzik-reservation__field"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={defaultScrollViewport}
                  transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.06 }}
                >
                  <Icon size={18} className="muzik-reservation__field-icon" aria-hidden="true" />
                  <input
                    type={field.type}
                    placeholder={label}
                    aria-label={label}
                    className="muzik-reservation__input"
                  />
                </motion.div>
              );
            })}
          </div>

          <motion.button
            type="submit"
            className="muzik-reservation__cta"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.spring, delay: 0.3 }}
          >
            {t("muzikCafeReservation.cta")}
          </motion.button>
        </form>
      </div>
    </section>
  );
}

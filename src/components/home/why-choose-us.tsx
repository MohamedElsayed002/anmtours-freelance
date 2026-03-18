"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Shield, MapPin, HeadphonesIcon, BadgeCheck } from "lucide-react";

const FEATURES = [
  { icon: Shield, key: "secure" },
  { icon: MapPin, key: "destinations" },
  { icon: HeadphonesIcon, key: "support" },
  { icon: BadgeCheck, key: "quality" },
] as const;

export function WhyChooseUs() {
  const t = useTranslations("WhyChooseUs");

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium uppercase tracking-wider text-teal-600">
            {t("subtitle")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("description")}</p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {FEATURES.map(({ icon: Icon, key }) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 transition-colors group-hover:bg-teal-500/20">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`${key}Desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

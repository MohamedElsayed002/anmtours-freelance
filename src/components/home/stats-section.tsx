"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const STATS = [
  { key: "tours", suffix: "+" },
  { key: "customers", suffix: "+" },
  { key: "destinations", suffix: "" },
  { key: "years", suffix: "+" },
] as const;

export function StatsSection() {
  const t = useTranslations("Stats");

  return (
    <section className="border-y bg-teal-600 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {STATS.map(({ key, suffix }) => (
            <motion.div
              key={key}
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-3xl font-bold text-white md:text-4xl">
                {t(`${key}Count`)}
                {suffix}
              </p>
              <p className="mt-1 text-sm font-medium text-teal-100">
                {t(key)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

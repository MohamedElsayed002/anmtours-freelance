"use client";

import { motion } from "framer-motion";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  /** Faster animation for above-the-fold content */
  fast?: boolean;
};

export function AnimatedSection({
  children,
  className,
  fast = false,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: fast ? "-20px" : "-80px" }}
      transition={{ duration: fast ? 0.4 : 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/**
 * Syncs dir and lang attributes to the document root for proper RTL support.
 * Must be rendered inside a locale layout.
 */
export function RtlSync() {
  const locale = useLocale();

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

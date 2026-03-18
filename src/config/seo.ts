/**
 * SEO configuration. Set BASE_URL in .env for production.
 */

import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export const SEO_CONFIG = {
  siteName: "A&T Tours",
  ogImage: "/logo.jpeg",
  getBaseUrl: (): string => {
    if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, "");
    if (process.env.VERCEL_URL)
      return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
    return "https://anntours.vercel.app";
  },
};

export function buildLocaleUrl(locale: Locale, path = ""): string {
  const base = SEO_CONFIG.getBaseUrl();
  const cleanPath = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return `${base}/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
}

export function buildAlternates(path = ""): {
  canonical: string;
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = buildLocaleUrl(locale, path);
  }
  return {
    canonical: languages[routing.defaultLocale],
    languages,
  };
}

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "ru", "it"],
  defaultLocale: "en",
  localePrefix: "always",
});

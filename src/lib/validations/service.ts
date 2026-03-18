import { z } from "zod";

export type TranslationFn = (key: string, values?: Record<string, string | number>) => string;

const localeItemsSchema = z.object({
  lang: z.string(),
  items: z.array(z.string()),
});

export const createServiceSchema = (t: TranslationFn) => {
  const detailSchema = z.object({
    lang: z.string().min(1, t("required")),
    title: z.string().min(1, t("required")),
    description: z.string().min(1, t("required")),
  });

  return z.object({
    coverImage: z.string().min(1, t("required")),
    images: z.array(z.string()),
    details: z.array(detailSchema).min(1, t("minLengthArray")),
    highlights: z.array(localeItemsSchema).optional().default([]),
    includes: z.array(localeItemsSchema).optional().default([]),
    excludes: z.array(localeItemsSchema).optional().default([]),
    goodToKnow: z.array(localeItemsSchema).optional().default([]),
    priceAdult: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
      .refine((val) => !isNaN(val), t("invalidNumber"))
      .refine((val) => val >= 0, t("minPrice")),
    priceKids: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === "" || val === undefined) return 0;
        const num = typeof val === "string" ? parseFloat(val) : val;
        return isNaN(num) ? 0 : Math.max(0, num);
      }),
    duration: z.string().optional(),
    location: z.string().optional(),
    category: z.string().optional(),
    maxParticipants: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === "" || val === undefined) return undefined;
        const num = typeof val === "string" ? parseInt(val, 10) : val;
        return isNaN(num) ? undefined : num;
      }),
    slug: z.string().min(1, t("required")),
  });
};

export type ServiceFormValues = z.infer<ReturnType<typeof createServiceSchema>>;

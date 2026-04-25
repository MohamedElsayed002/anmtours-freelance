import { prisma } from "@/lib/prisma";

export type ServiceDetail = {
  lang: string;
  title: string;
  description: string;
};

export type ServiceWithDetails = Awaited<ReturnType<typeof getServices>>[number];

export async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { isActive: true},
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB may be unavailable during build (e.g. Vercel without DATABASE_URL)
    return [];
  }
}

/** Get up to `limit` services, each from a different location (no duplicates). */
export async function getServicesWithUniqueLocations(limit = 4) {
  const services = await getServices();
  const seen = new Set<string>();
  const result: Awaited<ReturnType<typeof getServices>> = [];
  for (const s of services) {
    const loc = (s.location ?? "").trim() || "Other";
    if (!seen.has(loc) && result.length < limit) {
      seen.add(loc);
      result.push(s);
    }
  }
  return result;
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug, isActive: true },
  });
}

export function getServiceDetailForLocale(
  details: unknown,
  locale: string
): ServiceDetail | null {
  const arr = Array.isArray(details) ? details : [];
  const found = arr.find(
    (d: { lang?: string }) => d?.lang === locale
  ) as ServiceDetail | undefined;
  if (found) return found;
  const fallback = arr.find(
    (d: { lang?: string }) => d?.lang === "en"
  ) as ServiceDetail | undefined;
  return fallback ?? (arr[0] as ServiceDetail) ?? null;
}

/** Get string array for locale from [{lang, items: string[]}] */
export function getArrayForLocale(
  data: unknown,
  locale: string
): string[] {
  const arr = Array.isArray(data) ? data : [];
  const found = arr.find(
    (d: { lang?: string; items?: string[] }) => d?.lang === locale
  ) as { items?: string[] } | undefined;
  if (found?.items) return found.items;
  const fallback = arr.find(
    (d: { lang?: string }) => d?.lang === "en"
  ) as { items?: string[] } | undefined;
  return fallback?.items ?? (arr[0] as { items?: string[] })?.items ?? [];
}

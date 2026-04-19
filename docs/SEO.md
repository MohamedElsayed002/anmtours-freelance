# SEO Implementation Guide

This document describes the SEO enhancements made to the A&M Tours travel agency project and explains the challenging parts.

---

## What Was Implemented

### 1. **Centralized SEO Configuration** (`src/config/seo.ts`)

- **Base URL**: Configurable via `BASE_URL` env var (falls back to Vercel URL or `https://anntours.vercel.app`)
- **Locale-specific metadata**: Titles and descriptions for EN, AR, RU, IT
- **Helpers**: `buildLocaleUrl()`, `buildAlternates()` for canonical URLs and hreflang

### 2. **Dynamic Metadata** (`generateMetadata`)

Every page exports `generateMetadata` for localized SEO:

| Page                               | Metadata                                                       |
| ---------------------------------- | -------------------------------------------------------------- |
| **Layout** (`[locale]/layout.tsx`) | Default title, description, Open Graph, Twitter cards          |
| **Home**                           | Home-specific title, description, alternates                   |
| **Destinations**                   | Tours listing metadata                                         |
| **About**                          | About page metadata                                            |
| **Contact**                        | Contact page metadata                                          |
| **Travel Tips**                    | Travel tips metadata                                           |
| **Services** (`[slug]`)            | Dynamic metadata from service title, description, image, price |

### 3. **International SEO (hreflang)**

- **Canonical URLs**: Each page has a canonical URL pointing to the preferred locale version
- **Language alternates**: All 4 locales (en, ar, ru, it) are linked via `alternates.languages`
- **Open Graph locale**: Set per page for proper social sharing

### 4. **Open Graph & Twitter Cards**

- **OG tags**: `type`, `url`, `title`, `description`, `images`, `siteName`
- **Twitter**: `summary_large_image` with title and description
- **Images**: Service pages use their cover image; others use site logo

### 5. **Sitemap** (`src/app/sitemap.ts`)

- **Static pages**: Home, destinations, about, contact, travel-tips (all locales)
- **Dynamic pages**: All services with slugs (all locales)
- **Change frequency**: `daily` for home, `weekly` for others
- **Priority**: Home = 1, services = 0.9, static = 0.8

### 6. **Robots.txt** (`src/app/robots.ts`)

- **Allow**: All pages
- **Disallow**: `/admin/`, `/api/`, `/services/add`
- **Sitemap**: Points to `/sitemap.xml`

### 7. **JSON-LD Structured Data**

- **Organization** (home): `TravelAgency` schema with contact, address, logo
- **WebSite** (home): Search action for destinations
- **TouristTrip** (services): Tour schema with name, description, image, price, location, duration

### 8. **Metadata Translations**

- **Namespace**: `Metadata` in `messages/en.json`, `ar.json`, `it.json`, `ru.json`
- **Keys**: `homeTitle`, `homeDescription`, `destinationsTitle`, etc.

### 9. **Root Layout Metadata**

- **metadataBase**: Ensures absolute URLs for OG images in production
- **Verification placeholders**: Ready for Google/Yandex search console verification

---

## Challenging Parts

### 1. **Locale-Aware Metadata with next-intl**

**Challenge**: `generateMetadata` runs on the server. `getTranslations` must receive the locale from `params` to avoid hydration mismatches and to support static generation.

**Solution**: Pass `{ locale, namespace: "Metadata" }` to `getTranslations`. The locale comes from the `[locale]` route param.

```ts
const t = await getTranslations({ locale, namespace: "Metadata" });
return { title: t("homeTitle"), description: t("homeDescription") };
```

### 2. **Alternate URLs for Nested Routes**

**Challenge**: The layout wraps all pages under `[locale]`. The layout doesn’t know the current path (e.g. `destinations` vs `services/slug`). Canonical and hreflang must be correct per page.

**Solution**: Each page defines its own `generateMetadata` and passes the correct path to `buildAlternates(path)`:

- Home: `buildAlternates("")`
- Destinations: `buildAlternates("destinations")`
- Services: `buildAlternates(`services/${slug}`)`

### 3. **Dynamic Sitemap with Database**

**Challenge**: The sitemap needs all service slugs. During build, the database might be unavailable (e.g. Vercel without `DATABASE_URL`).

**Solution**: Wrap `getServices()` in try/catch. If it fails, the sitemap still includes all static pages. Services are added when the DB is available.

### 4. **Base URL in Different Environments**

**Challenge**: `BASE_URL` must work in dev, preview, and production. Vercel provides `VERCEL_URL` but not the full URL.

**Solution**: Use `process.env.BASE_URL || (process.env.VERCEL_URL ? \`https://${process.env.VERCEL_URL}\` : "https://anntours.vercel.app")`. Set `BASE_URL` in production for the canonical domain.

### 5. **HTML `lang` Attribute**

**Challenge**: The root layout has `<html lang="en">`. For i18n, `lang` should match the locale (e.g. `ar` for Arabic).

**Solution**: The root layout is shared and does not receive `locale`. Changing `lang` dynamically would require either a different layout structure or moving the `<html>` tag into the locale layout. For now, this is a known limitation; metadata and hreflang still provide strong i18n signals.

### 6. **Service Images for Open Graph**

**Challenge**: Service cover images can be full URLs (e.g. UploadThing) or relative paths.

**Solution**: Check `image?.startsWith("http")` before using. For relative URLs, prepend `baseUrl`.

### 7. **JSON-LD Schema Type for Tours**

**Challenge**: `Product` or `Service` are common, but tours fit `TouristTrip` or `TouristAttraction` better.

**Solution**: Use `TouristTrip` schema with `provider`, `offers`, `location`, and `duration` for tour-related pages.

### 8. **Metadata Merging**

**Challenge**: Layout and page metadata can overlap. Next.js merges them; the page’s metadata overrides the layout’s.

**Solution**: Layout provides default metadata for the locale. Pages override `title`, `description`, `alternates`, and `openGraph` as needed.

---

## Environment Variables

| Variable     | Required | Description                                                                                           |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `BASE_URL`   | No       | Canonical site URL (e.g. `https://anntours.vercel.app`). Used for sitemap, canonical URLs, OG images. |
| `VERCEL_URL` | Auto     | Set by Vercel. Used as fallback when `BASE_URL` is not set.                                           |

---

## Next Steps (Optional)

1. **Add `BASE_URL`** to `.env` and Vercel for production.
2. **Google Search Console**: Add property and verify using the provided meta tag.
3. **Bing Webmaster Tools**: Add and verify the site.
4. **Improve OG image**: Use a 1200×630 image for better social sharing.
5. **BreadcrumbList**: Add JSON-LD breadcrumbs for service pages.
6. **FAQ schema**: Add FAQ schema on the travel tips page if applicable.

---

## Files Summary

| File                                        | Purpose                                    |
| ------------------------------------------- | ------------------------------------------ |
| `src/config/seo.ts`                         | SEO config, base URL, helpers              |
| `src/app/sitemap.ts`                        | Dynamic sitemap                            |
| `src/app/robots.ts`                         | Robots.txt                                 |
| `src/app/[locale]/layout.tsx`               | generateMetadata for locale                |
| `src/app/[locale]/page.tsx`                 | Home metadata + JSON-LD                    |
| `src/app/[locale]/destinations/page.tsx`    | Destinations metadata                      |
| `src/app/[locale]/about/page.tsx`           | About metadata                             |
| `src/app/[locale]/contact/page.tsx`         | Contact metadata                           |
| `src/app/[locale]/travel-tips/page.tsx`     | Travel tips metadata                       |
| `src/app/[locale]/services/[slug]/page.tsx` | Service metadata + JSON-LD                 |
| `src/components/seo/json-ld.tsx`            | Organization, WebSite, TouristTrip schemas |
| `messages/*.json`                           | Metadata translations (Metadata namespace) |

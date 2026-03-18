# Pagination Implementation

This document explains the pagination functionality added to the Destinations page (`/destinations`).

---

## Overview

Pagination was added so that the Destinations page shows **10 services per page** instead of all services at once. Users can navigate between pages using prev/next buttons and page number links. The current page is stored in the URL (`?page=N`), making links shareable and bookmarkable.

---

## What Was Done

### 1. Pagination Component (`src/components/ui/pagination.tsx`)

A reusable, readable pagination component was created with the following:

| Prop | Type | Description |
|------|------|--------------|
| `currentPage` | number | Current page number (1-based) |
| `totalPages` | number | Total number of pages |
| `basePath` | string | Base path for links (e.g. `/destinations`) |
| `ariaLabel` | string (optional) | Accessibility label for the nav element |
| `className` | string (optional) | Extra CSS classes |

**Behavior:**
- **Prev/Next buttons** – Navigate to previous or next page; disabled on first/last page
- **Page number buttons** – Click to jump to a specific page
- **Ellipsis** – When there are many pages, shows `1 … 4 5 6 … 10` instead of all numbers
- **URL-based** – Uses `?page=N` in the URL so links can be shared or bookmarked

**Helper function:**
- `getVisiblePageNumbers(currentPage, totalPages)` – Returns which page numbers to display, using `-1` to represent an ellipsis

---

### 2. Destinations Page Integration (`src/components/destinations/destinations-content.tsx`)

**Constants:**
- `ITEMS_PER_PAGE = 10` – Number of service cards per page

**Logic:**
1. **Read page from URL** – Uses `useSearchParams()` to get the `page` query parameter
2. **Parse and validate** – Parses the value as an integer, defaults to 1, ensures it’s at least 1
3. **Clamp to valid range** – If the user is on page 5 and filters reduce results to 2 pages, the current page is clamped to 2
4. **Slice the list** – `paginatedItems = filteredAndSorted.slice(startIndex, startIndex + ITEMS_PER_PAGE)`
5. **Render** – The grid shows `paginatedItems` instead of the full list
6. **Pagination UI** – The `Pagination` component is rendered below the grid when there is more than one page

**Flow:**
```
filteredAndSorted (all matching services)
    → totalPages = ceil(totalItems / 10)
    → currentPage = clamped value from URL
    → paginatedItems = slice for current page
    → render paginatedItems + Pagination
```

---

### 3. Destinations Page Wrapper (`src/app/[locale]/destinations/page.tsx`)

- Wrapped `DestinationsContent` in `<Suspense>` because it uses `useSearchParams()`
- Next.js requires Suspense for components that use `useSearchParams` during static rendering
- A simple loading fallback is shown while the client hydrates

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/components/ui/pagination.tsx` | **New file** – Reusable pagination component |
| `src/components/destinations/destinations-content.tsx` | Added pagination logic, `useSearchParams`, `usePathname`, and `Pagination` usage |
| `src/app/[locale]/destinations/page.tsx` | Wrapped content in `Suspense` |

---

## How It Works With Filters

Pagination works together with the existing filters (search, category, location, duration, price):

1. Filters are applied first → `filteredAndSorted`
2. Pagination is applied to the filtered list
3. When filters change, the number of pages may change
4. If the current page becomes invalid (e.g. page 5 with only 2 pages), it is clamped to the last valid page

---

## Usage Example

- **Page 1:** `/en/destinations` or `/en/destinations?page=1` → shows services 1–10  
- **Page 2:** `/en/destinations?page=2` → shows services 11–20  
- **Page 3:** `/en/destinations?page=3` → shows services 21–30  

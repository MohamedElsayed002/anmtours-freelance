"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for the Pagination component.
 * All values are 1-based for readability (page 1 = first page).
 */
type PaginationProps = {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Base path for links (e.g. "/destinations"). Query param ?page=N is appended. */
  basePath: string;
  /** Optional: aria-label for the nav element */
  ariaLabel?: string;
  /** Optional: extra class names */
  className?: string;
};

/**
 * Builds a URL with the page query parameter.
 * Example: buildPageUrl("/destinations", 2) → "/destinations?page=2"
 */
function buildPageUrl(basePath: string, page: number): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

/**
 * Pagination component for navigating between pages of results.
 * Uses URL query params (?page=N) for shareable, bookmarkable links.
 * Renders prev/next buttons and a range of page numbers.
 */
export function Pagination({
  currentPage,
  totalPages,
  basePath,
  ariaLabel = "Pagination",
  className,
}: PaginationProps) {
  const pathname = usePathname();
  const effectiveBasePath = basePath || pathname;

  // Nothing to show if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  // Page numbers to display (e.g. [1, 2, 3, ..., 10] or [1, ..., 4, 5, 6, ...])
  const pageNumbers = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {/* Previous button */}
      {isFirstPage ? (
        <Button variant="outline" size="icon" disabled aria-disabled>
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous page</span>
        </Button>
      ) : (
        <Button variant="outline" size="icon" asChild>
          <Link
            href={buildPageUrl(effectiveBasePath, currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
      )}

      {/* Page number buttons */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, index) => {
          const isEllipsis = pageNum === -1;
          const isActive = pageNum === currentPage;

          if (isEllipsis) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
                aria-hidden
              >
                …
              </span>
            );
          }

          if (isActive) {
            return (
              <Button
                key={pageNum}
                variant="default"
                size="icon"
                className="min-w-9"
                aria-current="page"
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </Button>
            );
          }

          return (
            <Button key={pageNum} variant="outline" size="icon" asChild>
              <Link
                href={buildPageUrl(effectiveBasePath, pageNum)}
                aria-label={`Go to page ${pageNum}`}
                className="min-w-9"
              >
                {pageNum}
              </Link>
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      {isLastPage ? (
        <Button variant="outline" size="icon" disabled aria-disabled>
          <ChevronRight className="size-4" />
          <span className="sr-only">Next page</span>
        </Button>
      ) : (
        <Button variant="outline" size="icon" asChild>
          <Link
            href={buildPageUrl(effectiveBasePath, currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      )}
    </nav>
  );
}

/**
 * Returns an array of page numbers to display, with -1 representing an ellipsis.
 * Example: [1, 2, 3, -1, 10] or [1, -1, 4, 5, 6, -1, 10]
 */
function getVisiblePageNumbers(currentPage: number, totalPages: number): number[] {
  const maxVisible = 5; // Max page buttons to show (excluding ellipsis)

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: number[] = [];
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push(-1); // ellipsis
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push(-1); // ellipsis
    pages.push(totalPages);
  }

  return pages;
}

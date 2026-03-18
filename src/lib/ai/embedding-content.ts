import type { ServiceForEmbedding } from "./types";

function extractTextFromLocaleArray(
  arr: { lang: string; items: string[] }[] | null | undefined
): string {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  return arr
    .flatMap((e) => e.items ?? [])
    .filter(Boolean)
    .join(" ");
}

function extractDetailsText(details: ServiceForEmbedding["details"]): string {
  if (!Array.isArray(details) || details.length === 0) return "";
  return details
    .map((d) => `${d.title || ""} ${d.description || ""}`.trim())
    .filter(Boolean)
    .join(" ");
}

/**
 * Builds a rich text representation of the service for embedding.
 * Combines all searchable fields into a single string.
 */
export function buildEmbeddingContent(service: ServiceForEmbedding): string {
  const parts: string[] = [];

  // Title and description
  const detailsText = extractDetailsText(service.details);
  if (detailsText) parts.push(detailsText);

  // Highlights
  const highlightsText = extractTextFromLocaleArray(service.highlights);
  if (highlightsText) parts.push(`Highlights: ${highlightsText}`);

  // Includes (hotel pickup, meals, etc.)
  const includesText = extractTextFromLocaleArray(service.includes);
  if (includesText) parts.push(`Included: ${includesText}`);

  // Excludes
  const excludesText = extractTextFromLocaleArray(service.excludes);
  if (excludesText) parts.push(`Not included: ${excludesText}`);

  // Good to know
  const goodToKnowText = extractTextFromLocaleArray(service.goodToKnow);
  if (goodToKnowText) parts.push(`Good to know: ${goodToKnowText}`);

  // Structured metadata
  if (service.duration) parts.push(`Duration: ${service.duration}`);
  if (service.category) parts.push(`Category: ${service.category}`);
  if (service.location) parts.push(`Location: ${service.location}`);
  if (service.maxParticipants)
    parts.push(`Max participants: ${service.maxParticipants}`);

  return parts.join(". ").trim() || "Travel experience";
}

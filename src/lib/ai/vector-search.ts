/**
 * Vector similarity search using cosine similarity.
 * Works with any MongoDB (Atlas or self-hosted).
 * For large datasets, consider MongoDB Atlas Vector Search.
 */

import { prisma } from "@/lib/prisma";
import type { EmbeddingVector } from "./embeddings";
import type { RecommendationFilters } from "./types";

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

function matchesDurationFilter(
  serviceDuration: string | null,
  filterDuration?: string
): boolean {
  if (!filterDuration) return true;
  if (!serviceDuration) return false;
  const d = serviceDuration.toLowerCase();
  const f = filterDuration.toLowerCase();
  if (f.includes("half") || f.includes("half day"))
    return d.includes("half") || d.includes("half day");
  if (f.includes("full") || f.includes("full day") || f.includes("1 day"))
    return d.includes("full") || d.includes("day") || d.includes("1");
  return d.includes(f);
}

export interface VectorSearchResult {
  serviceId: string;
  score: number;
  embedding: {
    tags: string[];
    targetAudience: string[];
    physicalLevel: string | null;
    bestTimeOfDay: string | null;
  };
}

/**
 * Perform similarity search with optional metadata filtering.
 * Fetches embeddings, filters by metadata, then ranks by cosine similarity.
 */
export async function vectorSearch(
  queryEmbedding: EmbeddingVector,
  filters?: RecommendationFilters,
  limit = 10
): Promise<VectorSearchResult[]> {
  const embeddings = await prisma.serviceEmbedding.findMany({
    include: {
      service: {
        select: {
          id: true,
          slug: true,
          details: true,
          highlights: true,
          includes: true,
          excludes: true,
          priceAdult: true,
          priceKids: true,
          duration: true,
          category: true,
          location: true,
          maxParticipants: true,
          isActive: true,
        },
      },
    },
  });

  const queryVector = queryEmbedding as number[];
  const results: VectorSearchResult[] = [];

  for (const emb of embeddings) {
    if (!emb.service.isActive) continue;

    // Metadata filters
    if (filters?.maxPrice != null && emb.service.priceAdult > filters.maxPrice)
      continue;
    if (filters?.minPrice != null && emb.service.priceAdult < filters.minPrice)
      continue;
    if (
      filters?.duration &&
      !matchesDurationFilter(emb.service.duration, filters.duration)
    )
      continue;
    if (
      filters?.category &&
      emb.service.category?.toLowerCase() !== filters.category.toLowerCase()
    )
      continue;
    if (
      filters?.maxParticipants != null &&
      emb.service.maxParticipants != null &&
      emb.service.maxParticipants < filters.maxParticipants
    )
      continue;
    if (
      filters?.targetAudience?.length &&
      !filters.targetAudience.some((t) =>
        emb.targetAudience.some(
          (a) => a.toLowerCase() === t.toLowerCase()
        )
      )
    )
      continue;
    if (
      filters?.physicalLevel &&
      emb.physicalLevel?.toLowerCase() !== filters.physicalLevel.toLowerCase()
    )
      continue;

    const vec = emb.embedding as unknown as number[];
    const score = cosineSimilarity(queryVector, vec);
    results.push({
      serviceId: emb.serviceId,
      score,
      embedding: {
        tags: emb.tags,
        targetAudience: emb.targetAudience,
        physicalLevel: emb.physicalLevel,
        bestTimeOfDay: emb.bestTimeOfDay,
      },
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

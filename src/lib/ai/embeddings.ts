/**
 * OpenAI Embeddings - Generate and store vectors for services
 */

import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { buildEmbeddingContent } from "./embedding-content";
import type { ServiceForEmbedding } from "./types";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is required for embeddings");
  return new OpenAI({ apiKey: key });
}

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

export type EmbeddingVector = number[];

/**
 * Generate embedding vector for a text string using OpenAI
 */
export async function generateEmbedding(text: string): Promise<EmbeddingVector> {
  const openai = getOpenAI();
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.slice(0, 8191), // Model limit
  });
  return response.data[0].embedding as EmbeddingVector;
}

/**
 * Infer tags, target audience, physical level, and best time from service content
 * for metadata filtering (simple heuristic - can be enhanced with LLM)
 */
function inferMetadata(service: ServiceForEmbedding): {
  tags: string[];
  targetAudience: string[];
  physicalLevel: "Easy" | "Moderate" | "Hard" | null;
  bestTimeOfDay: "Morning" | "Sunset" | "Night" | null;
} {
  const content = buildEmbeddingContent(service).toLowerCase();
  const tags: string[] = [];
  const targetAudience: string[] = [];

  // Category as tag
  if (service.category) tags.push(service.category.toLowerCase());

  // Target audience from content
  if (
    /romantic|couple|honeymoon|wedding|two people/i.test(content) ||
    content.includes("couples")
  )
    targetAudience.push("couples");
  if (
    /family|families|children|kids|child|family-friendly/i.test(content)
  )
    targetAudience.push("families");
  if (/kids|children|child-friendly/i.test(content)) targetAudience.push("kids");
  if (
    /group|groups|corporate|team|party/i.test(content) ||
    (service.maxParticipants && service.maxParticipants > 4)
  )
    targetAudience.push("groups");

  // Physical level
  let physicalLevel: "Easy" | "Moderate" | "Hard" | null = null;
  if (/easy|relax|relaxing|gentle|leisurely/i.test(content))
    physicalLevel = "Easy";
  else if (/moderate|medium|moderate/i.test(content)) physicalLevel = "Moderate";
  else if (/hard|challenging|intense|adventure|diving|safari/i.test(content))
    physicalLevel = "Hard";

  // Best time
  let bestTimeOfDay: "Morning" | "Sunset" | "Night" | null = null;
  if (/morning|sunrise|dawn|early/i.test(content)) bestTimeOfDay = "Morning";
  else if (/sunset|evening|golden hour/i.test(content)) bestTimeOfDay = "Sunset";
  else if (/night|stargazing|nocturnal/i.test(content)) bestTimeOfDay = "Night";

  return { tags, targetAudience, physicalLevel, bestTimeOfDay };
}

/**
 * Generate embedding for a service and store in ServiceEmbedding table
 */
export async function generateAndStoreServiceEmbedding(
  service: ServiceForEmbedding
): Promise<void> {
  const content = buildEmbeddingContent(service);
  const embedding = await generateEmbedding(content);
  const { tags, targetAudience, physicalLevel, bestTimeOfDay } =
    inferMetadata(service);

  await prisma.serviceEmbedding.upsert({
    where: { serviceId: service.id },
    create: {
      serviceId: service.id,
      embedding: embedding as unknown as object,
      content,
      tags,
      targetAudience,
      physicalLevel,
      bestTimeOfDay,
    },
    update: {
      embedding: embedding as unknown as object,
      content,
      tags,
      targetAudience,
      physicalLevel,
      bestTimeOfDay,
    },
  });
}

/**
 * Delete embedding when service is deleted (handled by Prisma cascade)
 */
export async function deleteServiceEmbedding(serviceId: string): Promise<void> {
  await prisma.serviceEmbedding.deleteMany({ where: { serviceId } });
}

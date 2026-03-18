import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractTextFromLocaleArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  return arr.flatMap((e) => e.items ?? []).filter(Boolean).join(" ");
}

function extractDetailsText(details) {
  if (!Array.isArray(details) || details.length === 0) return "";
  return details
    .map((d) => `${d.title || ""} ${d.description || ""}`.trim())
    .filter(Boolean)
    .join(" ");
}

function buildEmbeddingContent(service) {
  const parts = [];
  const detailsText = extractDetailsText(service.details);
  if (detailsText) parts.push(detailsText);
  const highlightsText = extractTextFromLocaleArray(service.highlights);
  if (highlightsText) parts.push(`Highlights: ${highlightsText}`);
  const includesText = extractTextFromLocaleArray(service.includes);
  if (includesText) parts.push(`Included: ${includesText}`);
  const excludesText = extractTextFromLocaleArray(service.excludes);
  if (excludesText) parts.push(`Not included: ${excludesText}`);
  const goodToKnowText = extractTextFromLocaleArray(service.goodToKnow);
  if (goodToKnowText) parts.push(`Good to know: ${goodToKnowText}`);
  if (service.duration) parts.push(`Duration: ${service.duration}`);
  if (service.category) parts.push(`Category: ${service.category}`);
  if (service.location) parts.push(`Location: ${service.location}`);
  if (service.maxParticipants)
    parts.push(`Max participants: ${service.maxParticipants}`);
  return parts.join(". ").trim() || "Travel experience";
}

function inferMetadata(service) {
  const content = buildEmbeddingContent(service).toLowerCase();
  const tags = service.category ? [service.category.toLowerCase()] : [];
  const targetAudience = [];
  if (/romantic|couple|honeymoon|two people/i.test(content))
    targetAudience.push("couples");
  if (/family|families|children|kids|child-friendly/i.test(content))
    targetAudience.push("families", "kids");
  if (/group|groups|corporate|team/i.test(content) || (service.maxParticipants && service.maxParticipants > 4))
    targetAudience.push("groups");

  let physicalLevel = null;
  if (/easy|relax|relaxing|gentle/i.test(content)) physicalLevel = "Easy";
  else if (/moderate|medium/i.test(content)) physicalLevel = "Moderate";
  else if (/hard|challenging|adventure|diving|safari/i.test(content))
    physicalLevel = "Hard";

  let bestTimeOfDay = null;
  if (/morning|sunrise|dawn|early/i.test(content)) bestTimeOfDay = "Morning";
  else if (/sunset|evening|golden hour/i.test(content)) bestTimeOfDay = "Sunset";
  else if (/night|stargazing/i.test(content)) bestTimeOfDay = "Night";

  return { tags, targetAudience, physicalLevel, bestTimeOfDay };
}

async function main() {
  const services = await prisma.service.findMany();
  console.log(`Found ${services.length} services. Generating embeddings...`);

  for (const service of services) {
    try {
      const content = buildEmbeddingContent(service);
      const response = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: content,
      });
      const embedding = response.data[0].embedding;
      const { tags, targetAudience, physicalLevel, bestTimeOfDay } =
        inferMetadata(service);

      await prisma.serviceEmbedding.upsert({
        where: { serviceId: service.id },
        create: {
          serviceId: service.id,
          embedding,
          content,
          tags,
          targetAudience,
          physicalLevel,
          bestTimeOfDay,
        },
        update: {
          embedding,
          content,
          tags,
          targetAudience,
          physicalLevel,
          bestTimeOfDay,
        },
      });
      console.log(`✓ ${service.slug}`);
    } catch (err) {
      console.error(`✗ ${service.slug}:`, err.message);
    }
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

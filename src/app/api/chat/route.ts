/**
 * Streaming Chat API - RAG-powered travel assistant
 * Uses Vercel AI SDK streamText for real-time token streaming
 */

import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { getRecommendedServices } from "@/lib/ai/recommendation";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { messages, locale = "en" } = await request.json();
    const baseUrl = process.env.BASE_URL || "https://anntours.vercel.app";

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userContent =
      typeof lastMessage?.content === "string"
        ? lastMessage.content
        : Array.isArray(lastMessage?.content)
          ? lastMessage.content
              .filter((p: { type?: string; text?: string }) => p.type === "text")
              .map((p: { text?: string }) => p.text)
              .join(" ")
          : "";

    const recommendedServices = await getRecommendedServices(userContent, 5);

    const servicesContext =
      recommendedServices.length > 0
        ? recommendedServices
            .map((rec, i) => {
              const s = rec.service;
              const title =
                Array.isArray(s.details) && s.details[0]
                  ? (s.details[0] as { title?: string }).title || "Experience"
                  : "Experience";
              const desc =
                Array.isArray(s.details) && s.details[0]
                  ? (s.details[0] as { description?: string }).description || ""
                  : "";
              const highlights = Array.isArray(s.highlights)
                ? (s.highlights[0] as { items?: string[] })?.items ?? []
                : [];
              const includes = Array.isArray(s.includes)
                ? (s.includes[0] as { items?: string[] })?.items ?? []
                : [];
              const excludes = Array.isArray(s.excludes)
                ? (s.excludes[0] as { items?: string[] })?.items ?? []
                : [];
              const hotelPickup = includes.some(
                (item) =>
                  typeof item === "string" &&
                  /hotel|pickup|transfer|pick.?up/i.test(item)
              );
              return `${i + 1}. **${title}** (slug: ${s.slug})
   - Price: $${s.priceAdult} per adult${s.priceKids ? `, $${s.priceKids} per child` : ""}
   - Duration: ${s.duration || "N/A"}
   - Category: ${s.category || "N/A"}
   - Location: ${s.location || "Sharm El Sheikh"}
   - Highlights: ${highlights.slice(0, 5).join("; ")}
   - Included: ${includes.join("; ")}
   - Not included: ${excludes.join("; ")}
   - Hotel pickup: ${hotelPickup ? "Yes" : "No"}`;
            })
            .join("\n\n")
        : "No matching services found.";

    const systemPrompt = buildSystemPrompt(servicesContext, {
      baseUrl,
      locale: String(locale),
    });

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

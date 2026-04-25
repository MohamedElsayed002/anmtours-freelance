import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAndStoreServiceEmbedding } from "@/lib/ai";
import { isServiceLocation } from "@/lib/service-location";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      coverImage,
      images,
      details,
      highlights,
      includes,
      excludes,
      goodToKnow,
      priceAdult,
      priceKids,
      duration,
      location,
      category,
      serviceLocation,
      maxParticipants,
      slug,
    } = body;

    if (!coverImage || !details || !Array.isArray(details) || details.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: coverImage, details (at least one)" },
        { status: 400 }
      );
    }

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    if (!isServiceLocation(serviceLocation)) {
      return NextResponse.json(
        { error: "Valid serviceLocation is required" },
        { status: 400 }
      );
    }

    const priceAdultNum = typeof priceAdult === "string" ? parseFloat(priceAdult) : priceAdult;
    const priceKidsNum = typeof priceKids === "string" ? parseFloat(priceKids) : (priceKids ?? 0);
    if (isNaN(priceAdultNum) || priceAdultNum < 0) {
      return NextResponse.json(
        { error: "Valid adult price is required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        coverImage,
        images: Array.isArray(images) ? images : [],
        details: details as object,
        highlights: Array.isArray(highlights) && highlights.length > 0 ? (highlights as object) : null,
        includes: Array.isArray(includes) && includes.length > 0 ? (includes as object) : null,
        excludes: Array.isArray(excludes) && excludes.length > 0 ? (excludes as object) : null,
        goodToKnow: Array.isArray(goodToKnow) && goodToKnow.length > 0 ? (goodToKnow as object) : null,
        priceAdult: priceAdultNum,
        priceKids: isNaN(priceKidsNum) ? 0 : Math.max(0, priceKidsNum),
        duration: duration || null,
        location: location || null,
        category: category || null,
        serviceLocation,
        maxParticipants: maxParticipants ?? null,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    try {
      await generateAndStoreServiceEmbedding({
        id: service.id,
        details: service.details as { lang: string; title: string; description: string }[],
        highlights: service.highlights as { lang: string; items: string[] }[] | null,
        includes: service.includes as { lang: string; items: string[] }[] | null,
        excludes: service.excludes as { lang: string; items: string[] }[] | null,
        goodToKnow: service.goodToKnow as { lang: string; items: string[] }[] | null,
        duration: service.duration,
        category: service.category,
        location: service.location,
        maxParticipants: service.maxParticipants,
        priceAdult: service.priceAdult,
      });
    } catch (embedError) {
      console.error("Failed to generate embedding (service still created):", embedError);
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

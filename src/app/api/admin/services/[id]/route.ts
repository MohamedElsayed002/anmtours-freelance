import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAndStoreServiceEmbedding } from "@/lib/ai";
import { isServiceLocation } from "@/lib/service-location";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Failed to fetch service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      isActive,
    } = body;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (
      serviceLocation !== undefined &&
      !isServiceLocation(serviceLocation)
    ) {
      return NextResponse.json(
        { error: "Valid serviceLocation is required" },
        { status: 400 }
      );
    }

    const priceAdultNum =
      typeof priceAdult !== "undefined"
        ? (typeof priceAdult === "string" ? parseFloat(priceAdult) : priceAdult)
        : existing.priceAdult;
    const priceKidsNum =
      typeof priceKids !== "undefined"
        ? (typeof priceKids === "string" ? parseFloat(priceKids) : priceKids)
        : existing.priceKids;

    const filterLocaleItems = (arr: unknown) => {
      if (!Array.isArray(arr)) return null;
      const filtered = arr
        .map((e: { lang?: string; items?: string[] }) => ({
          lang: e?.lang ?? "en",
          items: (e?.items ?? []).filter((s: string) => s?.trim()),
        }))
        .filter((e) => e.items.length > 0);
      return filtered.length > 0 ? (filtered as object) : null;
    };

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(coverImage !== undefined && { coverImage }),
        ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
        ...(details !== undefined && { details: details as object }),
        ...(highlights !== undefined && { highlights: filterLocaleItems(highlights) }),
        ...(includes !== undefined && { includes: filterLocaleItems(includes) }),
        ...(excludes !== undefined && { excludes: filterLocaleItems(excludes) }),
        ...(goodToKnow !== undefined && { goodToKnow: filterLocaleItems(goodToKnow) }),
        ...(priceAdultNum !== undefined && { priceAdult: priceAdultNum }),
        ...(priceKidsNum !== undefined && { priceKids: priceKidsNum ?? 0 }),
        ...(duration !== undefined && { duration: duration || null }),
        ...(location !== undefined && { location: location || null }),
        ...(category !== undefined && { category: category || null }),
        ...(serviceLocation !== undefined && { serviceLocation }),
        ...(maxParticipants !== undefined && {
          maxParticipants: maxParticipants ?? null,
        }),
        ...(slug !== undefined && {
          slug: String(slug).toLowerCase().replace(/\s+/g, "-"),
        }),
        ...(typeof isActive === "boolean" && { isActive }),
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
      console.error("Failed to update embedding:", embedError);
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}

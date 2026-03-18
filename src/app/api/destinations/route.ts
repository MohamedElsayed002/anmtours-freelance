import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price } = body;

    if (!name || !description || price == null) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price" },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.create({
      data: {
        name,
        description,
        price: Number(price),
      },
    });

    return NextResponse.json(destination);
  } catch (error) {
    console.error("Failed to create destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}

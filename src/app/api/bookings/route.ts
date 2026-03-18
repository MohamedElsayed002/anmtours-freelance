import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true, firstName: true, lastName: true, imageUrl: true, role: true },
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "User not found or email required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { date, adults, children, total, serviceId } = body;

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      );
    }

    const adultsNum = typeof adults === "number" ? adults : parseInt(String(adults), 10);
    const childrenNum = typeof children === "number" ? children : parseInt(String(children), 10);
    const totalNum = typeof total === "number" ? total : parseFloat(String(total));

    if (isNaN(adultsNum) || adultsNum < 0 || isNaN(childrenNum) || childrenNum < 0 || isNaN(totalNum)) {
      return NextResponse.json(
        { error: "Invalid adults, children, or total" },
        { status: 400 }
      );
    }

    const data: Parameters<typeof prisma.booking.create>[0]["data"] = {
      date: dateObj,
      adults: adultsNum,
      children: childrenNum,
      total: totalNum,
      user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          imageUrl: user.imageUrl ?? undefined,
          role: user.role,
        },
    };
    if (serviceId && typeof serviceId === "string") {
      data.serviceId = serviceId;
    }
    const booking = await prisma.booking.create({ data });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

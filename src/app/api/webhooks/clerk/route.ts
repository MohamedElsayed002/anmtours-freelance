import { verifyWebhook } from "@clerk/backend/webhooks";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UserJSON } from "@clerk/backend";

function getPrimaryEmail(user: UserJSON): string | null {
  const primaryId = user.primary_email_address_id;
  const email = user.email_addresses?.find((e) => e.id === primaryId);
  return email?.email_address ?? user.email_addresses?.[0]?.email_address ?? null;
}

function getPrimaryPhone(user: UserJSON): string | null {
  const primaryId = user.primary_phone_number_id;
  const phone = user.phone_numbers?.find((p) => p.id === primaryId);
  return phone?.phone_number ?? user.phone_numbers?.[0]?.phone_number ?? null;
}

function getGender(user: UserJSON): string | null {
  const metadata = user.public_metadata as Record<string, unknown> | undefined;
  if (metadata && typeof metadata.gender === "string") {
    return metadata.gender;
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const user = evt.data as UserJSON;

      const roleFromMetadata = (user.public_metadata as Record<string, unknown>)?.role;
      const role = roleFromMetadata === "ADMIN" ? "ADMIN" : "USER";

      await prisma.user.upsert({
        where: { clerkId: user.id },
        create: {
          clerkId: user.id,
          email: getPrimaryEmail(user),
          firstName: user.first_name ?? null,
          lastName: user.last_name ?? null,
          imageUrl: user.image_url ?? null,
          gender: getGender(user),
          phoneNumber: getPrimaryPhone(user),
          role,
        },
        update: {
          email: getPrimaryEmail(user),
          firstName: user.first_name ?? null,
          lastName: user.last_name ?? null,
          imageUrl: user.image_url ?? null,
          gender: getGender(user),
          phoneNumber: getPrimaryPhone(user),
          role,
        },
      });
    }

    if (evt.type === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await prisma.user.deleteMany({ where: { clerkId: id } });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}

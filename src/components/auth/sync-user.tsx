import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Server component that syncs the current Clerk user to our database.
 * Runs on each request when user is signed in - ensures we have up-to-date data
 * even if webhooks were not configured or failed.
 */
export async function SyncUser() {
  let user;
  try {
    user = await currentUser();
  } catch (err) {
    console.error("[SyncUser] Clerk currentUser error:", err);
    return null;
  }
  if (!user) return null;

  try {
    const email = user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? null;
    const phone = user.phoneNumbers?.find((p) => p.id === user.primaryPhoneNumberId)
      ?.phoneNumber ?? user.phoneNumbers?.[0]?.phoneNumber ?? null;
    const metadata = user.publicMetadata as Record<string, unknown> | undefined;
    const gender = metadata?.gender as string | undefined;
    const role = metadata?.role === "ADMIN" ? "ADMIN" : "USER";

    const userModel = (prisma as { user?: { upsert: (args: unknown) => Promise<unknown> } }).user;
    if (!userModel?.upsert) {
      console.error(
        "[SyncUser] Prisma User model not found. Stop the dev server, run 'npx prisma generate', delete .next folder, then restart."
      );
      return null;
    }

    await userModel.upsert({
      where: { clerkId: user.id },
      create: {
        clerkId: user.id,
        email: email ?? null,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        imageUrl: user.imageUrl ?? null,
        gender: gender ?? null,
        phoneNumber: phone ?? null,
        role,
      },
      update: {
        email: email ?? null,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        imageUrl: user.imageUrl ?? null,
        gender: gender ?? null,
        phoneNumber: phone ?? null,
        role,
      },
    });
  } catch (err) {
    console.error("SyncUser error:", err);
  }

  return null;
}

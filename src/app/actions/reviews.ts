"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return reviews;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

export async function createReview(data: {
  authorName: string;
  authorImage?: string;
  rating: number;
  text: string;
  images: string[];
  addedAt?: Date;
}) {
  try {
    const review = await prisma.review.create({
      data: {
        authorName: data.authorName,
        authorImage: data.authorImage,
        rating: data.rating,
        text: data.text,
        images: data.images,
        addedAt: data.addedAt || new Date(),
      },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, review };
  } catch (error) {
    console.error("Failed to create review:", error);
    return { success: false, error: "Failed to create review" };
  }
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const createReview = async ({
  productId,
  rating,
  comment,
  userId,
}: {
  productId: string;
  rating: number;
  comment?: string;
  userId?: string;
}) => {
  try {
    // Créer la review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId,
      },
    });

    // Recalculer la note moyenne et le nombre d'avis pour le produit
    const reviews = await prisma.review.findMany({
      where: { productId },
    });

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length,
      },
    });

    return {
      message: "Avis enregistré.",
      review,
      rating: averageRating,
      reviewCount: reviews.length,
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'avis :", error);
    throw new Error("Impossible d'ajouter un avis");
  }
};

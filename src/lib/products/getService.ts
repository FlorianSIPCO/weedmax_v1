import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const getAllProducts = async (categorySlug?: string) => {
  try {
    const products = await prisma.product.findMany({
      where: categorySlug ? {
        category: {
          is: {
            slug: categorySlug
          }
        }
      } : undefined,
      include: {
        options: {
          include: {
            option: true,
            variants: true,
          }
        },
        category: true,
      },
    });

    // Tri par défaut : promos > nouveautés > catégorie (alphabétique)
    const sorted = products.sort((a, b) => {
      if (a.isPromo && !b.isPromo) return -1;
      if (!a.isPromo && b.isPromo) return 1;

      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;

      return (a.category?.name || "").localeCompare(b.category?.name || "");
    });

    return sorted;
    
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw new Error("Impossible de récupérer les produits.");
  }
};

export const getProductById = async (id: string) => {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            option: true,
            variants: true,
          }
        },
        category: true,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    throw new Error("Produit introuvable.");
  }
};

export const getNewProducts = async () => {
  try {
    return await prisma.product.findMany({
      where: {
        isNew: true,
      },
      include: {
        options: {
          include: {
            option: true,
            variants: true,
          }
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des nouveaux produits:", error);
    throw new Error("Impossible de récupérer les nouveaux produits.");
  }
};

export const getPromoProducts = async () => {
  try {
    return await prisma.product.findMany({
      where: {
        isPromo: true,
      },
      include: {
        options: {
          include: {
            option: true,
            variants: true,
          }
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits en promo:", error);
    throw new Error("Impossible de récupérer les promotions.");
  }
};


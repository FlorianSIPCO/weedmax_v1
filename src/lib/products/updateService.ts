import { ProductUpdateData } from "@/types";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const updateProduct = async (id: string, data: ProductUpdateData) => {
  try {
    // Formatage des specs : tableau de string "clé: valeur"
    const formattedSpecs = data.specs?.map((spec) =>
      typeof spec === "string" ? spec : `${spec.key}: ${spec.value}`
    );

    const formattedImages = data.images?.map((img) => ({
      url: img.url,
      public_id: img.public_id,
    }));

    // Supprimer toutes les anciennes options liées au produit
    await prisma.productOption.deleteMany({
      where: { productId: id },
    });

    // Recréer les nouvelles options et leurs variantes
    const createdOptions = data.options?.map((opt) => ({
      option: {
        connect: { id: opt.optionId },
      },
      variants: {
        create: opt.variants.map((v) => ({
          quantity: v.quantity,
          price: v.price,
        })),
      },
    }));

    // Mise à jour du produit
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        images: formattedImages,
        specs: formattedSpecs,
        description: data.description,
        stock: data.stock,
        categoryId: data.categoryId,
        isNew: data.isNew ?? undefined,
        isPromo: data.isPromo ?? undefined,
        promoPercentage: data.promoPercentage ?? undefined,
        rating: data.rating ?? undefined,
        reviewCount: data.reviewCount ?? undefined,
        options: {
          create: createdOptions,
        },
      },
      include: {
        options: {
          include: {
            option: true,
            variants: true,
          },
        },
        category: true,
      },
    });

    return updatedProduct;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    throw new Error("Impossible de mettre à jour le produit.");
  }
};

import { ProductData } from "@/types";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const createProduct = async (productData: ProductData) => {
  try {
    const { name, images, specs, description, stock, options, categoryId, isNew, isPromo, promoPercentage, rating, reviewCount} = productData;

    if (!categoryId) {
      throw new Error("La catégorie est obligatoire")
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Les images sont obligatoires");
    }

    if (!options?.length) {
      throw new Error('Au moins une variante (quantité/prix) est requise.')
    }

    const hasEmptyVariant = options.some(o => !o.variants || o.variants.length === 0);
      if (hasEmptyVariant) {
        throw new Error("Chaque option doit contenir au moins une variante (quantité/prix).");
      }

    const formattedSpecs = specs.map(spec => `${spec.key}: ${spec.value}`);

    const newProduct = await prisma.product.create({
      data: {
        name,
        images: images.map((img) => ({url: img.url, public_id: img.public_id})),
        specs: formattedSpecs,
        description,
        stock,
        isNew: isNew ?? null,
        isPromo: isPromo ?? null,
        promoPercentage: promoPercentage ?? null,
        rating: rating ?? null,
        reviewCount: reviewCount ?? null,
        category: { connect: {id: categoryId} },
        options: {
          create: options.map((opt) => ({
            option: {
              connect: { id: opt.optionId },
            },
            variants: {
              create: opt.variants.map(v => ({
                quantity: v.quantity,
                price:    v.price,
              })),
            },
          })),
        },
      },
      include: {
        options: { include: { variants: true }},
        category: true,
      }
    });

    return newProduct;
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    throw new Error("Impossible de créer le produit");
  }
};

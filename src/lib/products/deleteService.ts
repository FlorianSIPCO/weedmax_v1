import { PrismaClient } from "@/generated/prisma";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const deleteProduct = async (productId: string) => {
  try {
    // Récupérer les infos du produit avant suppression
    const product = await prisma.product.findUnique({ where: { id: productId }})

    if (!product) {
      throw new Error('Produit introuvable')
    }

    // Suppression des images sur Cloudinary si elles ont un public_id
    const images = product.images as { url: string; public_id?: string }[]; 

    await Promise.all(
      images.map(async (img) => {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
            console.log(`Image supprimée de Cloudinary : ${img.public_id}`);
          } catch (error) {
            console.error(`Erreur suppression Cloudinary : ${img.public_id}`, error);
          }
        }
      })
    );

    // Suppression de la base de données
    await prisma.product.delete({ where: { id: productId } });
    return { message: "Produit supprimé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    throw new Error("Impossible de supprimer le produit.");
  }
};

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const deleteUser = async (userId: string) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      throw new Error("Utilisateur non trouvé.");
    }

    await prisma.user.delete({ where: { id: userId } });

    return { message: "Utilisateur supprimé avec succès." };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw new Error("Impossible de supprimer l'utilisateur.");
  }
};

import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface UserUpdateData {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  role?: "ADMIN" | "CLIENT";
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}

export const updateUser = async (userId: string, data: UserUpdateData) => {
  try {
    const updateFields: any = { ...data };

    // Convertir dateOfBirth si présent
    if (data.dateOfBirth) {
      const formattedDate = new Date(data.dateOfBirth);
      if (isNaN(formattedDate.getTime())) {
        throw new Error("Format de date invalide. Utilisez YYYY-MM-DD");
      }
      updateFields.dateOfBirth = formattedDate;
    }

    // Hasher le mot de passe s'il est fourni
    if (data.password) {
      updateFields.password = await bcrypt.hash(data.password, 10);
    }

    // Mettre à jour l'adresse si fournie
    if (data.street || data.city || data.zipCode || data.country) {
      const userWithAddress = await prisma.user.findUnique({
        where: { id: userId },
        include: { addresses: true },
      });

      if (userWithAddress?.addresses.length) {
        await prisma.address.update({
          where: { id: userWithAddress.addresses[0].id },
          data: {
            street: data.street || undefined,
            city: data.city || undefined,
            zipCode: data.zipCode || undefined,
            country: data.country || undefined,
          },
        });
      }
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateFields,
    });

    return updatedUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    throw new Error("Impossible de mettre à jour l'utilisateur");
  }
};

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface UserUpdateData {
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { firstname, lastname, phoneNumber, email, password, newPassword } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const updatedData: Partial<UserUpdateData> = {
      firstname,
      lastname,
      phoneNumber,
      email,
    };

    // Modification du mot de passe si fourni
    if (password && newPassword) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
      }

      updatedData.password = await bcrypt.hash(newPassword, 10);
    }

    // Mise à jour des informations utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: updatedData,
    });

    return NextResponse.json({ message: "Profil mis à jour avec succès" }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Erreur serveur";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Erreur lors de la mise à jour du profil :", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

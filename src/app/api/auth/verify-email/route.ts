import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 400 });
  }

  // Recherche de l'utilisateur avec ce token
  const user = await prisma.user.findUnique({
    where: { emailVerificationToken: token },
  });

  if (!user) {
    return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 400 });
  }

  // Mise à jour de l'utilisateur pour confirmer l'email
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null, // Supprime le token après validation
    },
  });

  return NextResponse.json({ message: "Email vérifié avec succès" }, { status: 200 });
}

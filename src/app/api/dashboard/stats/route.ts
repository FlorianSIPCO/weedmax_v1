import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const clientCount = await prisma.user.count({ where: { role: "CLIENT" } });
    const productCount = await prisma.product.count();
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });

    return NextResponse.json({ clientCount, productCount, adminCount }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des stats :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.id !== context.params.id)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: context.params.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true
      }
    });

    // Convertir `total` en `Number` avant de renvoyer les données
    const formattedOrders = orders.map(order => ({
      ...order,
      total: Number(order.total), // Convertit Decimal en Number
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, getClients, getAdmin } from "@/lib/users/getService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Vérification des autorisations : Seul un ADMIN peut voir tous les utilisateurs
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    // Récupérer le paramètre `role` pour filtrer les utilisateurs
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    let users;

    if (role === "CLIENT") {
      users = await getClients(); // Récupère uniquement les clients
    } else if (role === "ADMIN") {
      users = await getAdmin();
    } else {
      users = await getAllUsers(); // Récupère tous les utilisateurs (admins et clients)
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs" }, { status: 500 });
  }
}

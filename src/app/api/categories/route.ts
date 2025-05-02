import { NextRequest, NextResponse } from "next/server";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/categoryService";

// Liste toutes les catégories
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}

// Crée une catégorie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }
    const newCategory = await createCategory(name);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie :", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    );
  }
}

// Met à jour une catégorie
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const body = await req.json();
  const { name } = body;

  if (!id || !name) {
    return NextResponse.json({ error: "ID et nom requis" }, { status: 400 });
  }

  try {
    const updated = await updateCategory(id, name);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie :", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la catégorie" },
      { status: 500 }
    );
  }
}

// Supprime une catégorie
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const deleted = await deleteCategory(id);
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie :", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la catégorie" },
      { status: 500 }
    );
  }
}

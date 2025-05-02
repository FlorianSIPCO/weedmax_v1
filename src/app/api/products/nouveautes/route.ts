import { NextResponse } from "next/server";
import { getNewProducts } from "@/lib/products/getService";

export async function GET() {
  try {
    const products = await getNewProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur récupération nouveautés :", error);
    return NextResponse.json({ error: "Erreur récupération nouveautés" }, { status: 500 });
  }
}

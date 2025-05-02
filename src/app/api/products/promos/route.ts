import { NextResponse } from "next/server";
import { getPromoProducts } from "@/lib/products/getService";

export async function GET() {
  try {
    const products = await getPromoProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur récupération promos :", error);
    return NextResponse.json({ error: "Erreur récupération promos" }, { status: 500 });
  }
}

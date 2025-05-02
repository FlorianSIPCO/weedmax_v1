import { NextRequest, NextResponse } from "next/server";
import { createReview } from "@/lib/reviews/CreateService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, comment, userId } = body;

    // Validation simple
    if (!productId || typeof rating !== "number") {
      return NextResponse.json({ error: "Champs manquants ou invalides." }, { status: 400 });
    }

    const review = await createReview({ productId, rating, comment, userId });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Erreur API /reviews :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

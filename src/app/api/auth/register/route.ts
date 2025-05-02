import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users/createService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newUser = await createUser(body);

    return NextResponse.json({ user: newUser, message: "Utilisateur créé avec succès" }, { status: 201 });
  } catch (error: unknown) {
    let errorMessage = 'Une ereure est survenue'

    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

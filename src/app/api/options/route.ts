import { NextRequest, NextResponse } from 'next/server';
import { getAllOptions, createOption } from '@/lib/options/optionService';

export async function GET() {
  try {
    const opts = await getAllOptions();
    return NextResponse.json(opts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const opt = await createOption(name);
    return NextResponse.json(opt, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur' }, { status: 400 });
  }
}

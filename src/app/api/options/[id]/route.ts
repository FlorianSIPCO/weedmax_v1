import { NextRequest, NextResponse } from 'next/server';
import { updateOption, deleteOption } from '@/lib/options/optionService';

export async function PUT(req: NextRequest, context: any) {
  try {
    const { name } = await req.json();
    const opt = await updateOption(context.params.id, name);
    return NextResponse.json(opt);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur' }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, context: any) {
  try {
    await deleteOption(context.params.id);
    return NextResponse.json({ message: 'Option supprimée' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur' }, { status: 400 });
  }
}

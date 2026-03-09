import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

// PATCH /api/strategies/[id] - 更新策略
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { error } = await supabase
      .from(TABLES.STRATEGIES)
      .update({
        name: body.name,
        description: body.description || '',
        content: body.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_system', false); // 防止更新系统策略

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating strategy:', error);
    return NextResponse.json({ error: 'Failed to update strategy' }, { status: 500 });
  }
}

// DELETE /api/strategies/[id] - 删除策略
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from(TABLES.STRATEGIES)
      .delete()
      .eq('id', id)
      .eq('is_system', false); // 防止删除系统策略

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting strategy:', error);
    return NextResponse.json({ error: 'Failed to delete strategy' }, { status: 500 });
  }
}

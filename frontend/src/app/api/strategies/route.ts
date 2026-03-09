import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import { randomUUID } from 'crypto';

// GET /api/strategies - 获取所有策略
export async function GET() {
  try {
    const { data, error } = await supabase
      .from(TABLES.STRATEGIES)
      .select('*')
      .order('is_system', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const strategies = data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      content: row.content,
      isSystem: row.is_system,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(strategies);
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return NextResponse.json({ error: 'Failed to fetch strategies' }, { status: 500 });
  }
}

// POST /api/strategies - 创建新策略
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const strategyId = randomUUID();

    const { data, error } = await supabase
      .from(TABLES.STRATEGIES)
      .insert({
        id: strategyId,
        name: body.name,
        description: body.description || '',
        content: body.content,
        is_system: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description,
      content: data.content,
      isSystem: data.is_system,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (error) {
    console.error('Error creating strategy:', error);
    return NextResponse.json({ error: 'Failed to create strategy' }, { status: 500 });
  }
}

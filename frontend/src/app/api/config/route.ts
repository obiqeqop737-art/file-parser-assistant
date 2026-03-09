import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

// GET /api/config - 获取所有配置
export async function GET() {
  try {
    const { data, error } = await supabase
      .from(TABLES.CONFIGS)
      .select('key, value');

    if (error) throw error;

    const configs: Record<string, string> = {};
    data.forEach((row) => {
      configs[row.key] = row.value || '';
    });

    return NextResponse.json(configs);
  } catch (error) {
    console.error('Error fetching configs:', error);
    return NextResponse.json({ error: 'Failed to fetch configs' }, { status: 500 });
  }
}

// POST /api/config - 更新配置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Upsert each config key
    for (const [key, value] of Object.entries(body)) {
      const { error } = await supabase
        .from(TABLES.CONFIGS)
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating configs:', error);
    return NextResponse.json({ error: 'Failed to update configs' }, { status: 500 });
  }
}

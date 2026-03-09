import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import { unlink } from 'fs/promises';

// GET /api/files/[id] - 获取单个文件
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data, error } = await supabase
      .from(TABLES.FILES)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      name: data.name,
      size: data.size,
      type: data.type,
      status: data.status,
      content: data.content,
      parseResult: data.parse_result,
      uploadedAt: data.created_at,
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

// DELETE /api/files/[id] - 删除单个文件
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 获取文件路径并删除物理文件
    const { data: fileData } = await supabase
      .from(TABLES.FILES)
      .select('file_path')
      .eq('id', id)
      .single();

    if (fileData?.file_path) {
      try {
        await unlink(fileData.file_path);
      } catch (e) {
        // 文件可能不存在，忽略错误
      }
    }

    const { error } = await supabase
      .from(TABLES.FILES)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}

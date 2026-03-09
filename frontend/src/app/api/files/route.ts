import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

// GET /api/files - 获取所有文件
export async function GET() {
  try {
    const { data, error } = await supabase
      .from(TABLES.FILES)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const files = data.map((row) => ({
      id: row.id,
      name: row.name,
      size: row.size,
      type: row.type,
      status: row.status,
      uploadedAt: row.created_at,
    }));

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

// POST /api/files - 上传文件
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileId = randomUUID();
    const fileExt = path.extname(file.name);
    const fileName = `${fileId}${fileExt}`;
    
    // 存储目录
    const uploadDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    
    // 写入文件
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    const { data, error } = await supabase
      .from(TABLES.FILES)
      .insert({
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        file_path: filePath,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      name: data.name,
      size: data.size,
      type: data.type,
      status: data.status,
      uploadedAt: data.created_at,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

// DELETE /api/files - 删除文件
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    // 获取文件路径并删除物理文件
    const { data: fileData, error: fetchError } = await supabase
      .from(TABLES.FILES)
      .select('file_path')
      .eq('id', fileId)
      .single();

    if (fileData?.file_path) {
      try {
        await unlink(fileData.file_path);
      } catch (e) {
        // 文件可能不存在，忽略错误
      }
    }

    // 删除数据库记录
    const { error } = await supabase
      .from(TABLES.FILES)
      .delete()
      .eq('id', fileId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}

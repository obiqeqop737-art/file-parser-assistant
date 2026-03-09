import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import { readFile } from 'fs/promises';
import base64 from 'base64-js';
import fetch from 'node-fetch';

// POST /api/parse - 解析文件
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, parseMode = 'default' } = body;

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    // 获取文件信息
    const { data: fileData, error: fetchError } = await supabase
      .from(TABLES.FILES)
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 更新状态为解析中
    await supabase
      .from(TABLES.FILES)
      .update({ status: 'parsing' })
      .eq('id', fileId);

    const filePath = fileData.file_path;
    const fileType = fileData.type;
    const fileName = fileData.name.toLowerCase();

    try {
      let content = '';

      // 根据文件类型解析
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        content = await parsePdf(filePath, parseMode);
      } else if (fileName.endsWith('.docx')) {
        content = await parseDocx(filePath);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
        content = await parseSpreadsheet(filePath);
      } else if (fileName.endsWith('.txt') || fileName.endsWith('.json')) {
        const buffer = await readFile(filePath);
        content = buffer.toString('utf-8');
      } else if (fileType.startsWith('image/')) {
        content = await parseImageOCR(filePath);
      }

      // 更新文件内容和状态
      await supabase
        .from(TABLES.FILES)
        .update({
          content,
          status: 'completed',
          parse_result: '',
        })
        .eq('id', fileId);

      return NextResponse.json({
        success: true,
        content,
      });
    } catch (parseError) {
      // 更新状态为失败
      await supabase
        .from(TABLES.FILES)
        .update({ status: 'failed' })
        .eq('id', fileId);

      throw parseError;
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function parsePdf(filePath: string, mode: string): Promise<string> {
  // 简单文本提取 - 实际需要 pdfplumber 或其他库
  const buffer = await readFile(filePath);
  
  // 检查是否为文本 PDF
  const header = buffer.slice(0, 5).toString();
  if (header === '%PDF-') {
    // 简单处理：返回提示信息
    // 实际生产需要安装 pdfplumber
    return `[PDF 文件已上传]\n文件路径: ${filePath}\n\n注意：完整 PDF 解析需要安装 pdfplumber 依赖。`;
  }
  
  return '[无法解析的文件格式]';
}

async function parseDocx(filePath: string): Promise<string> {
  // 简单处理 - 实际需要 mammoth 或 docx 库
  return `[Word 文档已上传]\n文件路径: ${filePath}\n\n注意：完整 DOCX 解析需要安装 mammoth 依赖。`;
}

async function parseSpreadsheet(filePath: string): Promise<string> {
  // 简单处理 - 实际需要 xlsx 或 pandas 库
  return `[电子表格已上传]\n文件路径: ${filePath}\n\n注意：完整 Excel/CSV 解析需要安装 xlsx 或 pandas 依赖。`;
}

async function parseImageOCR(filePath: string): Promise<string> {
  // 获取 API 配置
  const { data: configs } = await supabase
    .from(TABLES.CONFIGS)
    .select('key, value');
  
  const configMap: Record<string, string> = {};
  configs?.forEach((c) => {
    configMap[c.key] = c.value || '';
  });

  const apiKey = configMap.siliconflow_api_key;
  const ocrModel = configMap.ocr_model || 'Qwen/Qwen3-VL-8B-Instruct';

  if (!apiKey) {
    return '[需要配置 SiliconFlow API Key 才能使用 OCR]';
  }

  try {
    // 读取图片并 base64 编码
    const buffer = await readFile(filePath);
    const base64Data = base64.fromByteArray(new Uint8Array(buffer));

    // 调用 SiliconFlow OCR API
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ocrModel,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: '请识别这张图片中的所有文字内容，按原文顺序输出。' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Data}` } },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OCR API error: ${response.status}`);
    }

    const result = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    return result.choices?.[0]?.message?.content || '[OCR 无结果]';
  } catch (error) {
    return `[OCR 失败: ${String(error)}]`;
  }
}

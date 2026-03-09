import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import fetch from 'node-fetch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/chat - AI 对话（流式响应）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, fileId, strategyId } = body;

    // 获取配置
    const { data: configs } = await supabase
      .from(TABLES.CONFIGS)
      .select('key, value');

    const configMap: Record<string, string> = {};
    configs?.forEach((c) => {
      configMap[c.key] = c.value || '';
    });

    const apiKey = configMap.siliconflow_api_key;
    const mainModel = configMap.main_model || 'deepseek-ai/DeepSeek-V3.2';

    if (!apiKey) {
      return NextResponse.json({ error: '请先配置 SiliconFlow API Key' }, { status: 400 });
    }

    // 获取文件内容
    let fileContent = '';
    if (fileId) {
      const { data: fileData } = await supabase
        .from(TABLES.FILES)
        .select('content')
        .eq('id', fileId)
        .single();

      if (fileData?.content) {
        fileContent = fileData.content;
      }
    }

    // 获取策略内容
    let systemPrompt = '';
    if (strategyId) {
      const { data: strategyData } = await supabase
        .from(TABLES.STRATEGIES)
        .select('content')
        .eq('id', strategyId)
        .single();

      if (strategyData?.content) {
        systemPrompt = strategyData.content;
      }
    }

    // 构建请求消息
    const requestMessages: Array<{ role: string; content: string }> = [];

    if (systemPrompt) {
      requestMessages.push({ role: 'system', content: systemPrompt });
    }

    if (fileContent) {
      requestMessages.push({
        role: 'user',
        content: `以下是文件内容，请基于此回答问题：\n\n${fileContent}`,
      });
    }

    // 添加用户消息
    for (const msg of messages) {
      requestMessages.push({ role: msg.role, content: msg.content });
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: mainModel,
              messages: requestMessages,
              stream: true,
              max_tokens: 2000,
            }),
          });

          if (!response.ok) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `API error: ${response.status}` })}\n\n`));
            controller.close();
            return;
          }

          // @ts-ignore - node-fetch body is readable stream
          const reader = response.body.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices?.[0]?.delta?.content) {
                    const content = parsed.choices[0].delta.content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch {
                  // 忽略解析错误
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(error) })}\n\n`));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

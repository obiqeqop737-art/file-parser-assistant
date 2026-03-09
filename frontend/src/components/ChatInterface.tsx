'use client';

import React, { useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function ChatInterface() {
  const { messages, sendMessage, clearMessages, currentFile, currentStrategy } = useApp();
  const [input, setInput] = React.useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input.trim();
    setInput('');
    await sendMessage(content);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="p-6 border-b border-white/20 glass-card rounded-b-none">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">智能对话</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              {currentFile && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  文件：{currentFile.name}
                </span>
              )}
              {currentStrategy && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  策略：{currentStrategy.name}
                </span>
              )}
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500 hover:bg-red-50"
              onClick={clearMessages}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              清空
            </Button>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              欢迎使用文件解析助手
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              上传文件后，我可以根据您选择的策略对文件进行智能解析和对话。
            </p>
            <div className="text-sm text-gray-400">
              <p>• 选择合适的解析策略</p>
              <p>• 上传您要解析的文件</p>
              <p>• 开始与 AI 对话</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-4 animate-fade-in',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                )}>
                  {message.role === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className={cn(
                  'max-w-[80%]',
                  message.role === 'user' && 'text-right'
                )}>
                  <div className={cn(
                    'p-4 rounded-2xl',
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-md'
                      : 'bg-white/80 text-gray-800 rounded-tl-md glass-card'
                  )}>
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse align-middle"></span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 px-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* 输入框 */}
      <div className="p-6 border-t border-white/20">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            className="glass-input flex-1"
            disabled={!currentFile}
          />
          <Button
            type="submit"
            disabled={!input.trim() || !currentFile}
            className="glass-button px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {!currentFile && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            请先上传文件后再开始对话
          </p>
        )}
      </div>
    </div>
  );
}

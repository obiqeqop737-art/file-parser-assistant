'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Trash2, FileText, Sparkles, Upload, MessageSquare } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function ChatInterface() {
  const { messages, sendMessage, clearMessages, currentFile, currentStrategy } = useApp();
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 检测屏幕宽度
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <div className={cn(
        "p-4 md:p-6 border-b border-white/30 glass-card rounded-b-2xl",
        isMobile && "py-3 px-4"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo 图标 */}
            <div className={cn(
              "bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25",
              isMobile ? "w-10 h-10" : "w-12 h-12"
            )}>
              <Bot className={cn(
                "text-white",
                isMobile ? "h-5 w-5" : "h-6 w-6"
              )} />
            </div>
            <div>
              <h2 className={cn(
                "font-bold text-gray-800",
                isMobile ? "text-base" : "text-xl"
              )}>智能对话</h2>
              <div className="flex items-center gap-2 mt-0.5">
                {currentFile && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="truncate max-w-[120px]">{currentFile.name}</span>
                  </span>
                )}
                {currentStrategy && (
                  <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    <span>{currentStrategy.name}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl h-10 px-3"
              onClick={clearMessages}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline text-sm">清空</span>
            </Button>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <ScrollArea 
        className={cn(
          "flex-1 p-4 md:p-6",
          isMobile && "px-3 py-4"
        )} 
        ref={scrollRef}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 md:py-12 px-4">
            <div className={cn(
              "bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4 md:mb-6 shadow-xl shadow-blue-500/20",
              isMobile ? "w-16 h-16" : "w-24 h-24"
            )}>
              <Sparkles className={cn(
                "text-white",
                isMobile ? "h-8 w-8" : "h-12 w-12"
              )} />
            </div>
            <h3 className={cn(
              "font-bold text-gray-800 mb-2",
              isMobile ? "text-lg" : "text-2xl"
            )}>
              欢迎使用文件解析助手
            </h3>
            <p className="text-gray-500 max-w-xs md:max-w-md mb-6 md:mb-8">
              上传文件后，我可以根据您选择的策略对文件进行智能解析和对话。
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm text-gray-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full">
                <FileText className="h-3.5 w-3.5" />
                选择解析策略
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full">
                <Upload className="h-3.5 w-3.5" />
                上传文件
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full">
                <MessageSquare className="h-3.5 w-3.5" />
                开始对话
              </span>
            </div>
          </div>
        ) : (
          <div className={cn("space-y-4 md:space-y-6", isMobile && "space-y-4")}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2 md:gap-4 animate-fade-in',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* 头像 */}
                <div className={cn(
                  'shrink-0 flex items-center justify-center rounded-2xl shadow-lg',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600',
                  isMobile ? 'w-9 h-9' : 'w-11 h-11'
                )}>
                  {message.role === 'user' ? (
                    <User className={cn("text-white", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                  ) : (
                    <Bot className={cn("text-white", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                  )}
                </div>
                
                {/* 消息气泡 - 全宽 */}
                <div className={cn(
                  'flex-1 max-w-[85%] md:max-w-[75%]',
                  message.role === 'user' && 'text-right'
                )}>
                  <div className={cn(
                    'rounded-2xl shadow-md',
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-sm'
                      : 'bg-white/80 text-gray-800 rounded-tl-md glass-card',
                    isMobile ? 'p-3.5' : 'p-4'
                  )}>
                    <div className={cn(
                      "whitespace-pre-wrap text-left",
                      isMobile ? "text-sm leading-relaxed" : "text-base"
                    )}>
                      {message.content}
                    </div>
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse align-middle"></span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1.5 md:mt-2 px-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* 输入框 - 移动端固定在底部 */}
      <div className={cn(
        "border-t border-white/30 glass-card rounded-t-2xl",
        isMobile ? "p-3 pb-safe" : "p-4 md:p-6 pt-4"
      )}>
        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 items-center">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            className={cn(
              "glass-input rounded-xl border-0",
              isMobile ? "h-12 text-base px-4" : "h-12"
            )}
            disabled={!currentFile}
          />
          <Button
            type="submit"
            disabled={!input.trim() || !currentFile}
            className={cn(
              "glass-button rounded-xl shrink-0",
              isMobile ? "h-12 w-12 px-0" : "h-12 px-5"
            )}
          >
            <Send className={isMobile ? "h-5 w-5" : "h-5 w-5"} />
          </Button>
        </form>
        {!currentFile && (
          <p className="text-xs text-gray-400 mt-2.5 text-center">
            📎 请先上传文件后再开始对话
          </p>
        )}
      </div>
    </div>
  );
}

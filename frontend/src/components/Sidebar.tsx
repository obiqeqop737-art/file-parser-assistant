'use client';

import React from 'react';
import { FileText, MessageSquare, Settings, Plus, Trash2, FolderOpen, Bot, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const {
    files,
    currentFile,
    selectFile,
    deleteFile,
    currentPage,
    setCurrentPage,
  } = useApp();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'json':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNavClick = (page: 'chat' | 'strategies' | 'settings') => {
    setCurrentPage(page);
    onNavigate?.();
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Logo */}
      <div className="p-5 md:p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">文件解析助手</h1>
            <p className="text-xs text-gray-500">智能文档分析</p>
          </div>
        </div>
      </div>

      {/* 导航 */}
      <div className="p-4 md:p-4">
        <nav className="space-y-1.5 md:space-y-2">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 h-11 md:h-10 rounded-xl',
              currentPage === 'chat' 
                ? 'bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border border-blue-500/20' 
                : 'hover:bg-white/50'
            )}
            onClick={() => handleNavClick('chat')}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">智能对话</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 h-11 md:h-10 rounded-xl',
              currentPage === 'strategies' 
                ? 'bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border border-blue-500/20' 
                : 'hover:bg-white/50'
            )}
            onClick={() => handleNavClick('strategies')}
          >
            <Bot className="h-4 w-4" />
            <span className="text-sm">策略管理</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 h-11 md:h-10 rounded-xl',
              currentPage === 'settings' 
                ? 'bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border border-blue-500/20' 
                : 'hover:bg-white/50'
            )}
            onClick={() => handleNavClick('settings')}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">设置</span>
          </Button>
        </nav>
      </div>

      {/* 文件列表 */}
      <div className="flex-1 flex flex-col p-4 pt-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            文件列表
          </h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {files.length}
          </span>
        </div>

        <ScrollArea className="flex-1 -mx-2 px-2">
          {files.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>暂无文件</p>
              <p className="text-xs mt-1">点击上方上传文件</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    'group p-3 rounded-xl cursor-pointer transition-all duration-200',
                    currentFile?.id === file.id
                      ? 'bg-blue-500/10 border border-blue-500/20'
                      : 'bg-white/50 hover:bg-white/70 border border-transparent hover:border-white/30'
                  )}
                  onClick={() => {
                    selectFile(file);
                    onNavigate?.();
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

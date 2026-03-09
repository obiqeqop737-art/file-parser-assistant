'use client';

import React, { useState } from 'react';
import { MessageSquare, Bot, Settings, FileText, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  onMenuClick: () => void;
  showMenu: boolean;
}

export function BottomNavigation({ onMenuClick, showMenu }: BottomNavigationProps) {
  const { currentPage, setCurrentPage, files, currentFile, selectFile, currentStrategy } = useApp();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const navItems = [
    { id: 'chat', icon: MessageSquare, label: '对话' },
    { id: 'strategies', icon: Bot, label: '策略' },
    { id: 'settings', icon: Settings, label: '设置' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* 折叠内容区域 - 仅在对应页面显示 */}
      {currentPage === 'chat' && expandedSection === 'chat' && (
        <div className="absolute bottom-20 left-2 right-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 max-h-[40vh] overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">文件列表</span>
            <span className="text-xs text-gray-400">{files.length} 个文件</span>
          </div>
          <ScrollArea className="max-h-[calc(40vh-50px)]">
            {files.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                暂无文件，请上传
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => selectFile(file)}
                    className={cn(
                      'p-3 rounded-xl cursor-pointer transition-all',
                      currentFile?.id === file.id
                        ? 'bg-blue-500/10 border border-blue-500/20'
                        : 'hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {currentPage === 'strategies' && expandedSection === 'strategies' && (
        <div className="absolute bottom-20 left-2 right-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">当前策略</span>
          </div>
          {currentStrategy ? (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="font-medium text-blue-900">{currentStrategy.name}</p>
              <p className="text-xs text-blue-600 mt-1">{currentStrategy.description}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-2">请先选择一个策略</p>
          )}
        </div>
      )}

      {/* 底部导航栏 */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-white/30 shadow-lg">
        {/* 汉堡菜单按钮 */}
        <div className="absolute -top-12 left-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur shadow-md border border-white/30"
          >
            {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* 导航项 */}
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCurrentPage(item.id as 'chat' | 'strategies' | 'settings');
                  toggleSection(item.id);
                }}
                className={cn(
                  'h-12 w-12 rounded-xl transition-all',
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-500/10'
                    : 'text-gray-500'
                )}
              >
                <item.icon className="h-5 w-5" />
              </Button>
              <span className={cn(
                'text-xs mt-1',
                currentPage === item.id ? 'text-blue-600 font-medium' : 'text-gray-500'
              )}>
                {item.label}
              </span>

              {/* 展开指示器 */}
              {(item.id === 'chat' || item.id === 'strategies') && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -bottom-1 h-5 w-5 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(item.id);
                  }}
                >
                  {expandedSection === item.id ? (
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  ) : (
                    <ChevronUp className="h-3 w-3 text-gray-400" />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

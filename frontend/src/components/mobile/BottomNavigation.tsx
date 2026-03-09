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
        <div className="absolute bottom-20 left-3 right-3 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/40 max-h-[45vh] overflow-hidden">
          <div className="p-4 border-b border-gray-100/80 flex items-center justify-between">
            <span className="text-base font-semibold text-gray-800">📁 文件列表</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              {files.length} 个
            </span>
          </div>
          <ScrollArea className="max-h-[calc(45vh-60px)]">
            {files.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无文件，请上传</p>
              </div>
            ) : (
              <div className="p-2.5 space-y-1.5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => selectFile(file)}
                    className={cn(
                      'p-3.5 rounded-xl cursor-pointer transition-all duration-200',
                      currentFile?.id === file.id
                        ? 'bg-gradient-to-r from-blue-500/15 to-blue-600/10 border border-blue-500/30'
                        : 'hover:bg-gray-100/80 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                        currentFile?.id === file.id 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gray-100'
                      )}>
                        <FileText className={cn(
                          'h-4 w-4',
                          currentFile?.id === file.id ? 'text-white' : 'text-blue-500'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                      {currentFile?.id === file.id && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full shrink-0">
                          当前
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {currentPage === 'strategies' && expandedSection === 'strategies' && (
        <div className="absolute bottom-20 left-3 right-3 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-800">⚙️ 当前策略</span>
          </div>
          {currentStrategy ? (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100/50">
              <p className="font-semibold text-blue-900">{currentStrategy.name}</p>
              <p className="text-xs text-blue-600 mt-1.5">{currentStrategy.description}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">请先选择一个策略</p>
          )}
        </div>
      )}

      {/* 底部导航栏 - 重新设计 */}
      <div className="bg-white/85 backdrop-blur-2xl border-t border-white/40 shadow-lg shadow-black/5">
        {/* 汉堡菜单按钮 */}
        <div className="absolute -top-14 left-4">
          <Button
            variant="ghost"
            onClick={onMenuClick}
            className={cn(
              'h-12 w-12 rounded-2xl transition-all duration-300',
              showMenu 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-white/90 backdrop-blur-xl shadow-md border border-white/30'
            )}
          >
            {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* 导航项 - 图标 + 文字分开排列 */}
        <div className="flex items-center justify-around py-2.5 px-2">
          {navItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center relative">
              {/* 图标按钮 - 更大的触摸区域 */}
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentPage(item.id as 'chat' | 'strategies' | 'settings');
                  toggleSection(item.id);
                }}
                className={cn(
                  'h-14 w-14 rounded-2xl transition-all duration-200',
                  currentPage === item.id
                    ? 'text-blue-600 bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-500/30 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                )}
              >
                <item.icon className="h-6 w-6" />
              </Button>
              
              {/* 文字标签 - 分开排列 */}
              <span className={cn(
                'text-xs font-medium mt-1.5',
                currentPage === item.id ? 'text-blue-600' : 'text-gray-400'
              )}>
                {item.label}
              </span>

              {/* 展开指示器 */}
              {(item.id === 'chat' || item.id === 'strategies') && (
                <Button
                  variant="ghost"
                  className={cn(
                    'absolute -bottom-0.5 h-6 w-6 rounded-full transition-transform duration-200',
                    expandedSection === item.id ? 'rotate-180' : ''
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(item.id);
                  }}
                >
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

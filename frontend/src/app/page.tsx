'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { FileUpload } from '@/components/FileUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { StrategyManager } from '@/components/StrategyManager';
import { SettingsPage } from '@/components/SettingsPage';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { currentPage, setCurrentPage, currentFile } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 检测屏幕宽度 - 使用 md 断点 (768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 桌面端布局
  if (!isMobile) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* 侧边栏 - 固定在左侧 */}
        <Sidebar />
        
        {/* 主内容区 */}
        <div className="flex-1 overflow-hidden">
          {currentPage === 'chat' && (
            <div className="h-full flex flex-col">
              {!currentFile ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <Card className="w-full max-w-2xl glass-card">
                    <CardContent className="p-8">
                      <FileUpload />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <ChatInterface />
              )}
            </div>
          )}

          {currentPage === 'strategies' && <StrategyManager />}

          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </div>
    );
  }

  // 移动端布局 - 左侧导航栏
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="glass-card border-b border-white/30 px-4 py-3 flex items-center gap-3 z-10">
        {/* 汉堡菜单按钮 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 shrink-0"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </Button>
        
        {/* 标题 */}
        <div className="flex-1">
          <h1 className="font-bold text-gray-800 text-lg">文件解析助手</h1>
          <p className="text-xs text-gray-500">
            {currentPage === 'chat' && '智能对话'}
            {currentPage === 'strategies' && '策略管理'}
            {currentPage === 'settings' && '设置'}
          </p>
        </div>
        
        {/* 当前文件状态 */}
        {currentFile && (
          <div className="shrink-0">
            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              {currentFile.name.length > 10 ? currentFile.name.slice(0, 10) + '...' : currentFile.name}
            </span>
          </div>
        )}
      </header>

      {/* 左侧侧边栏遮罩层 */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* 左侧侧边栏 - 滑出式 */}
      <aside 
        className={`fixed top-0 left-0 h-full w-[280px] glass-sidebar z-40 transform transition-transform duration-300 ease-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden">
        {currentPage === 'chat' && (
          <div className="h-full flex flex-col">
            {!currentFile ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full glass-card">
                  <CardContent className="p-5">
                    <FileUpload />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <ChatInterface />
            )}
          </div>
        )}

        {currentPage === 'strategies' && <StrategyManager />}

        {currentPage === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

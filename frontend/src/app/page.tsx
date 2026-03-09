'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FileUpload } from '@/components/FileUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { StrategyManager } from '@/components/StrategyManager';
import { SettingsPage } from '@/components/SettingsPage';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { HamburgerMenu } from '@/components/mobile/HamburgerMenu';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { currentPage, setCurrentPage, currentFile } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 检测屏幕宽度 - 使用 md 断点 (768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 触摸滑动切换页面
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isMobile) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // 向左滑：切换到下一页
      if (currentPage === 'chat') setCurrentPage('strategies');
      else if (currentPage === 'strategies') setCurrentPage('settings');
    } else if (isRightSwipe) {
      // 向右滑：切换到上一页
      if (currentPage === 'settings') setCurrentPage('strategies');
      else if (currentPage === 'strategies') setCurrentPage('chat');
    }
  };

  // 桌面端布局
  if (!isMobile) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* 侧边栏 */}
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

  // 移动端布局
  return (
    <div 
      className="flex flex-col h-screen overflow-hidden"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 汉堡菜单 */}
      <HamburgerMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden pb-20">
        {currentPage === 'chat' && (
          <div className="h-full flex flex-col">
            {!currentFile ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full glass-card">
                  <CardContent className="p-6">
                    <FileUpload />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <ChatInterface onMenuClick={() => setShowMenu(true)} />
            )}
          </div>
        )}

        {currentPage === 'strategies' && (
          <StrategyManager onMenuClick={() => setShowMenu(true)} />
        )}

        {currentPage === 'settings' && <SettingsPage />}
      </div>

      {/* 底部导航 */}
      <BottomNavigation 
        onMenuClick={() => setShowMenu(!showMenu)} 
        showMenu={showMenu} 
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Bot, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MobileFileList } from './MobileFileList';
import { MobileStrategySelector } from './MobileStrategySelector';

interface BottomNavProps {
  onMenuClick: () => void;
  showMenu: boolean;
}

export function BottomNav({ onMenuClick, showMenu }: BottomNavProps) {
  const { currentPage, setCurrentPage, files, currentStrategy } = useApp();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;
  const navItems = [
    { id: 'chat', icon: MessageSquare, label: '对话', badge: files.length },
    { id: 'strategies', icon: Bot, label: '策略', badge: currentStrategy ? 1 : 0 },
    { id: 'settings', icon: Settings, label: '设置', badge: 0 },
  ];

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // 向左滑 - 切换到下一个页面
      const currentIndex = navItems.findIndex(item => item.id === currentPage);
      const nextIndex = (currentIndex + 1) % navItems.length;
      setCurrentPage(navItems[nextIndex].id as 'chat' | 'strategies' | 'settings');
      setExpandedSection(null);
    } else if (isRightSwipe) {
      // 向右滑 - 切换到上一个页面
      const currentIndex = navItems.findIndex(item => item.id === currentPage);
      const prevIndex = currentIndex === 0 ? navItems.length - 1 : currentIndex - 1;
      setCurrentPage(navItems[prevIndex].id as 'chat' | 'strategies' | 'settings');
      setExpandedSection(null);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNavClick = (pageId: string) => {
    if (pageId === currentPage) {
      // 点击当前页面时切换展开/收起
      toggleSection(pageId);
    } else {
      // 切换页面
      setCurrentPage(pageId as 'chat' | 'strategies' | 'settings');
      setExpandedSection(pageId);
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 折叠内容区域 */}
      {currentPage === 'chat' && (
        <MobileFileList 
          isExpanded={expandedSection === 'chat'} 
          onToggle={() => toggleSection('chat')} 
        />
      )}

      {currentPage === 'strategies' && (
        <MobileStrategySelector 
          isExpanded={expandedSection === 'strategies'}
          onToggle={() => toggleSection('strategies')}
        />
      )}

      {/* 底部导航栏 */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-white/30 shadow-lg">
        {/* 汉堡菜单按钮 */}
        <div className="absolute -top-14 left-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-11 w-11 rounded-full bg-white/90 backdrop-blur shadow-md border border-white/30"
          >
            {showMenu ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
        </div>

        {/* 导航项 */}
        <div className="flex items-center justify-around py-3 px-4 pt-4">
          {navItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center relative">
              {/* 展开指示按钮 - 位于图标下方 */}
              {(item.id === 'chat' || item.id === 'strategies') && expandedSection !== item.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -bottom-5 h-5 w-5 rounded-full bg-white/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(item.id);
                  }}
                >
                  <ChevronUp className="h-3 w-3 text-gray-400" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'h-12 w-12 rounded-xl transition-all relative',
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-500/10'
                    : 'text-gray-500'
                )}
              >
                <item.icon className="h-5 w-5" />
                {/* 角标 */}
                {item.badge > 0 && (
                  <span className={cn(
                    'absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold',
                    item.id === 'chat' ? 'bg-blue-500 text-white' : 
                    item.id === 'strategies' ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'
                  )}>
                    {item.badge}
                  </span>
                )}
              </Button>
              <span className={cn(
                'text-xs mt-1',
                currentPage === item.id ? 'text-blue-600 font-medium' : 'text-gray-500'
              )}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Bot, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MobileStrategySelectorProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function MobileStrategySelector({ isExpanded, onToggle }: MobileStrategySelectorProps) {
  const { strategies, currentStrategy, selectStrategy, setCurrentPage } = useApp();

  return (
    <div 
      className={cn(
        'absolute bottom-20 left-2 right-2 transition-all duration-300 ease-in-out',
        isExpanded 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 max-h-[45vh] overflow-hidden">
        {/* 头部 */}
        <div className="p-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xl z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">策略选择</span>
            {currentStrategy && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                已选: {currentStrategy.name}
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* 策略列表 */}
        <ScrollArea className="max-h-[calc(45vh-60px)]">
          <div className="p-2 space-y-2">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className={cn(
                  'p-4 rounded-xl cursor-pointer transition-all border',
                  currentStrategy?.id === strategy.id
                    ? 'bg-purple-50 border-purple-200'
                    : 'bg-white border-transparent hover:bg-gray-50'
                )}
                onClick={() => selectStrategy(strategy)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    strategy.isSystem
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  )}>
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">{strategy.name}</h4>
                      {strategy.isSystem && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                          系统
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {strategy.description || strategy.content}
                    </p>
                  </div>
                  {currentStrategy?.id === strategy.id && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* 底部操作 */}
        <div className="p-3 border-t border-gray-100 bg-white/95 backdrop-blur-xl">
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={() => {
              setCurrentPage('strategies');
              onToggle();
            }}
          >
            管理策略
          </Button>
        </div>
      </div>
    </div>
  );
}

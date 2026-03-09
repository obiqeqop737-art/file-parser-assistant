'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Bot, Menu } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface StrategyManagerProps {
  onMenuClick?: () => void;
}

export function StrategyManager({ onMenuClick }: StrategyManagerProps) {
  const {
    strategies,
    currentStrategy,
    selectStrategy,
    addStrategy,
    updateStrategy,
    deleteStrategy,
  } = useApp();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<string | null>(null);
  const [newStrategy, setNewStrategy] = useState({ name: '', description: '', content: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '', content: '' });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const handleAddStrategy = () => {
    if (!newStrategy.name.trim() || !newStrategy.content.trim()) return;
    addStrategy(newStrategy);
    setNewStrategy({ name: '', description: '', content: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditStrategy = (strategy: typeof strategies[0]) => {
    setEditingStrategy(strategy.id);
    setEditForm({
      name: strategy.name,
      description: strategy.description,
      content: strategy.content,
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!editForm.name.trim() || !editForm.content.trim()) return;
    updateStrategy(id, editForm);
    setEditingStrategy(null);
  };

  const handleCancelEdit = () => {
    setEditingStrategy(null);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          {isMobile && onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-9 w-9"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">策略管理</h2>
            <p className="text-gray-500 text-sm mt-0.5 md:mt-1 hidden sm:block">管理您的文件解析策略</p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glass-button text-sm h-9 md:h-10 md:text-base">
              <Plus className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">新建策略</span>
              <span className="sm:hidden">新建</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>创建新策略</DialogTitle>
              <DialogDescription>
                创建一个自定义的文件解析策略
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">策略名称</label>
                <Input
                  value={newStrategy.name}
                  onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                  placeholder="例如：我的专属解析策略"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">策略描述</label>
                <Input
                  value={newStrategy.description}
                  onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                  placeholder="简单描述这个策略的用途"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">策略内容</label>
                <Textarea
                  value={newStrategy.content}
                  onChange={(e) => setNewStrategy({ ...newStrategy, content: e.target.value })}
                  placeholder="输入 AI 的系统提示词..."
                  className="min-h-[150px] md:min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter className="flex-row gap-2 justify-end">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-sm">
                取消
              </Button>
              <Button className="glass-button text-sm" onClick={handleAddStrategy}>
                创建
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 策略列表 */}
      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy) => (
            <Card
              key={strategy.id}
              className={cn(
                'transition-all duration-300 cursor-pointer',
                currentStrategy?.id === strategy.id
                  ? 'ring-2 ring-blue-500 bg-blue-50/50'
                  : 'hover:shadow-lg',
                'glass-card'
              )}
              onClick={() => selectStrategy(strategy)}
            >
              <CardHeader className="pb-2 md:pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn(
                      'w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0',
                      strategy.isSystem
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    )}>
                      <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                    </div>
                    <CardTitle className="text-base md:text-lg truncate">{strategy.name}</CardTitle>
                  </div>
                  {currentStrategy?.id === strategy.id && (
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <CardDescription className="mt-1 md:mt-2 text-xs md:text-sm">
                  {strategy.description || '暂无描述'}
                </CardDescription>
                {strategy.isSystem && (
                  <span className="inline-block mt-1 md:mt-2 px-2 py-0.5 md:py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    系统预设
                  </span>
                )}
              </CardHeader>
              <CardContent className="pb-2 md:pb-3">
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-3">
                  {strategy.content}
                </p>
              </CardContent>
              {!strategy.isSystem && (
                <CardFooter className="pt-0 flex justify-end gap-1 md:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 md:h-8 w-7 md:w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStrategy(strategy);
                    }}
                  >
                    <Edit2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 md:h-8 w-7 md:w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStrategy(strategy.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* 编辑模态框 */}
      {editingStrategy && (
        <Dialog open={!!editingStrategy} onOpenChange={() => setEditingStrategy(null)}>
          <DialogContent className="w-[95vw] max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>编辑策略</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">策略名称</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">策略描述</label>
                <Input
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">策略内容</label>
                <Textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="min-h-[150px] md:min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter className="flex-row gap-2 justify-end">
              <Button variant="ghost" onClick={handleCancelEdit} className="text-sm">
                取消
              </Button>
              <Button className="glass-button text-sm" onClick={() => handleSaveEdit(editingStrategy)}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

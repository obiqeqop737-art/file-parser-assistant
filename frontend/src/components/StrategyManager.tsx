'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Bot } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function StrategyManager() {
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
    <div className="h-full flex flex-col p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">策略管理</h2>
          <p className="text-gray-500 mt-1">管理您的文件解析策略</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glass-button">
              <Plus className="h-4 w-4 mr-2" />
              新建策略
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
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
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                取消
              </Button>
              <Button className="glass-button" onClick={handleAddStrategy}>
                创建
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 策略列表 */}
      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      strategy.isSystem
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    )}>
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  </div>
                  {currentStrategy?.id === strategy.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {strategy.description || '暂无描述'}
                </CardDescription>
                {strategy.isSystem && (
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    系统预设
                  </span>
                )}
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {strategy.content}
                </p>
              </CardContent>
              {!strategy.isSystem && (
                <CardFooter className="pt-0 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStrategy(strategy);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStrategy(strategy.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
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
          <DialogContent className="sm:max-w-2xl">
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
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCancelEdit}>
                取消
              </Button>
              <Button className="glass-button" onClick={() => handleSaveEdit(editingStrategy)}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

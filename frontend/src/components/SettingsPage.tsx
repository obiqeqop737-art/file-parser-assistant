'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Bot, Key, FileText, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MAIN_MODELS, OCR_MODELS, ASR_MODELS } from '@/types';

// 折叠面板组件
function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

interface AccordionItemProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}

function AccordionItem({ title, description, icon, isOpen, onToggle, badge, children }: AccordionItemProps) {
  return (
    <div className="glass-card overflow-hidden">
      <button
        className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {description && <p className="text-xs text-gray-500">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 pt-0 border-t border-gray-100">{children}</div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(['models']);

  // 检测屏幕宽度
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className={cn(
      "h-full overflow-auto",
      isMobile ? "p-4" : "p-6"
    )}>
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className={cn(
                "font-bold text-gray-800",
                isMobile ? "text-lg" : "text-2xl"
              )}>设置</h2>
              <p className="text-gray-500 text-sm">配置您的文件解析助手</p>
            </div>
          </div>
        </div>

        <Accordion>
          {/* AI 模型设置 */}
          <AccordionItem
            title="AI 模型配置"
            description="选择主模型、OCR 和 ASR 模型"
            icon={<Bot className="h-5 w-5 text-white" />}
            isOpen={openSections.includes('models')}
            onToggle={() => toggleSection('models')}
            badge="3 项"
          >
            <div className="space-y-4 mt-4">
              {/* 主模型 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">主模型</label>
                <Select
                  value={settings.mainModel}
                  onValueChange={(value) => updateSettings({ mainModel: value })}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="选择主模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAIN_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* OCR 模型 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">OCR 模型</label>
                <Select
                  value={settings.ocrModel}
                  onValueChange={(value) => updateSettings({ ocrModel: value })}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="选择 OCR 模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCR_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ASR 模型 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ASR 模型</label>
                <Select
                  value={settings.asrModel}
                  onValueChange={(value) => updateSettings({ asrModel: value })}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="选择 ASR 模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASR_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionItem>

          {/* API 密钥设置 */}
          <AccordionItem
            title="API 密钥"
            description="配置 API 密钥以使用增强功能"
            icon={<Key className="h-5 w-5 text-white" />}
            isOpen={openSections.includes('api')}
            onToggle={() => toggleSection('api')}
          >
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">MinerU API Key</label>
                <Input
                  type="password"
                  value={settings.mineruApiKey}
                  onChange={(e) => updateSettings({ mineruApiKey: e.target.value })}
                  placeholder="输入您的 MinerU API Key"
                  className="glass-input"
                />
              </div>
              <p className="text-sm text-gray-500">
                MinerU 提供更强大的 PDF 解析能力，支持复杂排版和学术论文解析。
                <br />
                获取 API Key：访问 MinerU 官网注册账号
              </p>
            </div>
          </AccordionItem>

          {/* 解析设置 */}
          <AccordionItem
            title="解析模式"
            description="选择 PDF 文件的解析策略"
            icon={<FileText className="h-5 w-5 text-white" />}
            isOpen={openSections.includes('parsing')}
            onToggle={() => toggleSection('parsing')}
          >
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">解析模式</label>
                <Select
                  value={settings.parseMode}
                  onValueChange={(value: 'default' | 'mineru') => updateSettings({ parseMode: value })}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="选择解析模式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">
                      <div className="flex flex-col">
                        <span>模式 A：默认方案</span>
                        <span className="text-xs text-gray-500">pdfplumber + OCR 回退</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mineru">
                      <div className="flex flex-col">
                        <span>模式 B：MinerU 增强</span>
                        <span className="text-xs text-gray-500">需要 MinerU API Key</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={isMobile ? "space-y-3" : "grid gap-4 md:grid-cols-2"}>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-2">模式 A：默认方案</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 免费使用</li>
                    <li>• pdfplumber 提取文本</li>
                    <li>• 自动 OCR 回退</li>
                    <li>• 适合普通文档</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-2">模式 B：MinerU 增强</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• 深度布局分析</li>
                    <li>• 更强的 OCR 能力</li>
                    <li>• 支持复杂排版</li>
                    <li>• 适合学术论文</li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionItem>
        </Accordion>

        {/* 保存提示 */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <Save className="h-5 w-5 text-green-500 shrink-0" />
          <p className="text-sm text-green-700">
            设置会自动保存到本地浏览器存储中
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Bot, Key, FileText, Save, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
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
    <div className="glass-card overflow-hidden rounded-2xl">
      <button
        className="w-full p-4 md:p-5 flex items-center justify-between hover:bg-white/30 transition-all duration-200"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              {badge}
            </span>
          )}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 bg-gray-100",
            isOpen && "rotate-180"
          )}>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </button>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 pt-0 md:p-5 md:pt-0 border-t border-gray-100/50">{children}</div>
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
      "h-full overflow-auto pb-24",
      isMobile ? "p-4" : "p-6"
    )}>
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className={cn(
                "font-bold text-gray-800",
                isMobile ? "text-xl" : "text-2xl"
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
            <div className="space-y-5 mt-5">
              {/* 主模型 */}
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  主模型
                </label>
                <Select
                  value={settings.mainModel}
                  onValueChange={(value) => updateSettings({ mainModel: value })}
                >
                  <SelectTrigger className="glass-input h-12 rounded-xl border-0 shadow-sm">
                    <SelectValue placeholder="选择主模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAIN_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id} className="py-3">
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* OCR 模型 */}
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  OCR 模型
                </label>
                <Select
                  value={settings.ocrModel}
                  onValueChange={(value) => updateSettings({ ocrModel: value })}
                >
                  <SelectTrigger className="glass-input h-12 rounded-xl border-0 shadow-sm">
                    <SelectValue placeholder="选择 OCR 模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCR_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id} className="py-3">
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ASR 模型 */}
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  ASR 模型
                </label>
                <Select
                  value={settings.asrModel}
                  onValueChange={(value) => updateSettings({ asrModel: value })}
                >
                  <SelectTrigger className="glass-input h-12 rounded-xl border-0 shadow-sm">
                    <SelectValue placeholder="选择 ASR 模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASR_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id} className="py-3">
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
            <div className="space-y-4 mt-5">
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-gray-700">MinerU API Key</label>
                <Input
                  type="password"
                  value={settings.mineruApiKey}
                  onChange={(e) => updateSettings({ mineruApiKey: e.target.value })}
                  placeholder="输入您的 MinerU API Key"
                  className="glass-input h-12 rounded-xl border-0 shadow-sm"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100/50">
                <p className="text-sm text-gray-600">
                  💡 MinerU 提供更强大的 PDF 解析能力，支持复杂排版和学术论文解析。
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  获取 API Key：访问 MinerU 官网注册账号
                </p>
              </div>
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
            <div className="space-y-5 mt-5">
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-gray-700">解析模式</label>
                <Select
                  value={settings.parseMode}
                  onValueChange={(value: 'default' | 'mineru') => updateSettings({ parseMode: value })}
                >
                  <SelectTrigger className="glass-input h-12 rounded-xl border-0 shadow-sm">
                    <SelectValue placeholder="选择解析模式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default" className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">模式 A：默认方案</span>
                        <span className="text-xs text-gray-500">pdfplumber + OCR 回退</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mineru" className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">模式 B：MinerU 增强</span>
                        <span className="text-xs text-gray-500">需要 MinerU API Key</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 模式对比卡片 */}
              <div className={isMobile ? "space-y-3" : "grid gap-4 md:grid-cols-2"}>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📄</span>
                    <h4 className="font-semibold text-blue-900">模式 A：默认方案</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-blue-500" />
                      <span>免费使用</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-blue-500" />
                      <span>pdfplumber 提取文本</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-blue-500" />
                      <span>自动 OCR 回退</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-blue-500" />
                      <span>适合普通文档</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🚀</span>
                    <h4 className="font-semibold text-purple-900">模式 B：MinerU 增强</h4>
                  </div>
                  <ul className="text-sm text-purple-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-500" />
                      <span>深度布局分析</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-500" />
                      <span>更强的 OCR 能力</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-500" />
                      <span>支持复杂排版</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-500" />
                      <span>适合学术论文</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionItem>
        </Accordion>

        {/* 保存提示 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shrink-0">
            <Save className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-green-700">
            设置会自动保存到本地浏览器存储中
          </p>
        </div>
      </div>
    </div>
  );
}

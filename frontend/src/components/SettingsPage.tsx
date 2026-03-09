'use client';

import React from 'react';
import { Settings, Bot, Key, FileText, Save } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MAIN_MODELS, OCR_MODELS, ASR_MODELS } from '@/types';

export function SettingsPage() {
  const { settings, updateSettings } = useApp();

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">设置</h2>
              <p className="text-gray-500">配置您的文件解析助手</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="models" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="models">
              <Bot className="h-4 w-4 mr-2" />
              AI 模型
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API 密钥
            </TabsTrigger>
            <TabsTrigger value="parsing">
              <FileText className="h-4 w-4 mr-2" />
              解析设置
            </TabsTrigger>
          </TabsList>

          {/* AI 模型设置 */}
          <TabsContent value="models" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>主模型配置</CardTitle>
                <CardDescription>
                  选择用于文件解析和对话的主 AI 模型
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>OCR 模型配置</CardTitle>
                <CardDescription>
                  选择用于图片和扫描件识别的 OCR 模型
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>ASR 模型配置</CardTitle>
                <CardDescription>
                  选择用于语音转文字的 ASR 模型
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* API 密钥设置 */}
          <TabsContent value="api" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>MinerU API 密钥</CardTitle>
                <CardDescription>
                  配置 MinerU API 密钥以使用增强 PDF 解析功能
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>自定义 API 配置</CardTitle>
                <CardDescription>
                  配置您自己的 API 密钥（可选）
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  您可以配置自己的 API 密钥以使用自定义模型。此功能将在后续版本中推出。
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 解析设置 */}
          <TabsContent value="parsing" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>PDF 解析模式</CardTitle>
                <CardDescription>
                  选择 PDF 文件的解析策略
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="grid gap-4 mt-6 md:grid-cols-2">
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
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>其他设置</CardTitle>
                <CardDescription>
                  配置其他解析相关的选项
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  更多设置选项将在后续版本中推出。
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 保存提示 */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <Save className="h-5 w-5 text-green-500" />
          <p className="text-sm text-green-700">
            设置会自动保存到本地浏览器存储中
          </p>
        </div>
      </div>
    </div>
  );
}

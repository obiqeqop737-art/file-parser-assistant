'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FileItem, Strategy, Message, Settings, SYSTEM_STRATEGIES, MAIN_MODELS } from '@/types';

interface AppContextType {
  // 文件管理
  files: FileItem[];
  currentFile: FileItem | null;
  uploadFile: (file: File) => Promise<void>;
  selectFile: (file: FileItem | null) => void;
  deleteFile: (fileId: string) => void;
  isLoadingFiles: boolean;
  
  // 策略管理
  strategies: Strategy[];
  currentStrategy: Strategy | null;
  selectStrategy: (strategy: Strategy | null) => void;
  addStrategy: (strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'isSystem'>) => void;
  updateStrategy: (id: string, strategy: Partial<Strategy>) => void;
  deleteStrategy: (id: string) => void;
  isLoadingStrategies: boolean;
  
  // 聊天管理
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  
  // 设置管理
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  isLoadingSettings: boolean;
  
  // 导航
  currentPage: 'chat' | 'strategies' | 'settings';
  setCurrentPage: (page: 'chat' | 'strategies' | 'settings') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: Settings = {
  mainModel: MAIN_MODELS[0].id,
  ocrModel: 'Qwen/Qwen3-VL-8B-Instruct',
  asrModel: 'TeleAI/TeleSpeechASR',
  mineruApiKey: '',
  parseMode: 'default',
  customApiKeys: {},
};

export function AppProvider({ children }: { children: ReactNode }) {
  // 状态
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>(SYSTEM_STRATEGIES);
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(SYSTEM_STRATEGIES[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentPage, setCurrentPage] = useState<'chat' | 'strategies' | 'settings'>('chat');
  
  // 加载状态
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // 加载数据
  useEffect(() => {
    loadFiles();
    loadStrategies();
    loadSettings();
    loadMessages();
  }, []);

  // 从 API 加载文件
  const loadFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const res = await fetch('/api/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.map((f: any) => ({ ...f, uploadedAt: new Date(f.uploadedAt) })));
      }
    } catch (e) {
      console.error('Failed to load files:', e);
      // 回退到 localStorage
      const savedFiles = localStorage.getItem('file-parser-files');
      if (savedFiles) {
        try {
          const parsed = JSON.parse(savedFiles);
          setFiles(parsed.map((f: any) => ({ ...f, uploadedAt: new Date(f.uploadedAt) })));
        } catch {}
      }
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // 从 API 加载策略
  const loadStrategies = async () => {
    setIsLoadingStrategies(true);
    try {
      const res = await fetch('/api/strategies');
      if (res.ok) {
        const data = await res.json();
        const userStrategies = data.filter((s: any) => !s.isSystem).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
        }));
        setStrategies([...SYSTEM_STRATEGIES, ...userStrategies]);
      }
    } catch (e) {
      console.error('Failed to load strategies:', e);
      // 回退到 localStorage
      const savedStrategies = localStorage.getItem('file-parser-strategies');
      if (savedStrategies) {
        try {
          const parsed = JSON.parse(savedStrategies);
          const userStrategies = parsed.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
          }));
          setStrategies([...SYSTEM_STRATEGIES, ...userStrategies]);
        } catch {}
      }
    } finally {
      setIsLoadingStrategies(false);
    }
  };

  // 从 API 加载设置
  const loadSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          mainModel: data.main_model || MAIN_MODELS[0].id,
          ocrModel: data.ocr_model || 'Qwen/Qwen3-VL-8B-Instruct',
          asrModel: data.asr_model || 'TeleAI/TeleSpeechASR',
          mineruApiKey: data.mineru_api_key || '',
          parseMode: data.parse_mode || 'default',
          customApiKeys: {},
        });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
      // 回退到 localStorage
      const savedSettings = localStorage.getItem('file-parser-settings');
      if (savedSettings) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        } catch {}
      }
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // 加载消息（从 localStorage）
  const loadMessages = () => {
    const savedMessages = localStorage.getItem('file-parser-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error('Failed to load messages:', e);
      }
    }
  };

  // 保存到 localStorage 作为备份
  useEffect(() => {
    if (!isLoadingFiles) {
      localStorage.setItem('file-parser-files', JSON.stringify(files));
    }
  }, [files, isLoadingFiles]);

  useEffect(() => {
    if (!isLoadingStrategies) {
      const userStrategies = strategies.filter(s => !s.isSystem);
      localStorage.setItem('file-parser-strategies', JSON.stringify(userStrategies));
    }
  }, [strategies, isLoadingStrategies]);

  useEffect(() => {
    if (!isLoadingSettings) {
      localStorage.setItem('file-parser-settings', JSON.stringify(settings));
    }
  }, [settings, isLoadingSettings]);

  useEffect(() => {
    localStorage.setItem('file-parser-messages', JSON.stringify(messages));
  }, [messages]);

  // 文件管理
  const uploadFile = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const newFile: FileItem = {
          ...data,
          uploadedAt: new Date(data.uploadedAt),
        };
        setFiles(prev => [newFile, ...prev]);
        setCurrentFile(newFile);
      } else {
        throw new Error('Upload failed');
      }
    } catch (e) {
      console.error('Upload failed, using local fallback:', e);
      // 回退到本地创建
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        status: 'pending',
      };
      setFiles(prev => [newFile, ...prev]);
      setCurrentFile(newFile);
    }
  };

  const selectFile = (file: FileItem | null) => {
    setCurrentFile(file);
  };

  const deleteFile = async (fileId: string) => {
    try {
      await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Delete failed:', e);
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (currentFile?.id === fileId) {
      setCurrentFile(null);
    }
  };

  // 策略管理
  const selectStrategy = (strategy: Strategy | null) => {
    setCurrentStrategy(strategy);
  };

  const addStrategy = async (strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'isSystem'>) => {
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(strategy),
      });

      if (res.ok) {
        const data = await res.json();
        const newStrategy: Strategy = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        };
        setStrategies(prev => [...prev, newStrategy]);
      } else {
        throw new Error('Create failed');
      }
    } catch (e) {
      console.error('Create strategy failed, using local fallback:', e);
      // 回退到本地创建
      const newStrategy: Strategy = {
        ...strategy,
        id: Date.now().toString(),
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setStrategies(prev => [...prev, newStrategy]);
    }
  };

  const updateStrategy = async (id: string, updates: Partial<Strategy>) => {
    try {
      await fetch(`/api/strategies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error('Update failed:', e);
    }
    setStrategies(prev =>
      prev.map(s =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
      )
    );
  };

  const deleteStrategy = async (id: string) => {
    try {
      await fetch(`/api/strategies/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Delete failed:', e);
    }
    setStrategies(prev => prev.filter(s => s.id !== id));
    if (currentStrategy?.id === id) {
      setCurrentStrategy(SYSTEM_STRATEGIES[0]);
    }
  };

  // 聊天管理
  const sendMessage = async (content: string): Promise<void> => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // 创建 AI 消息
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // 调用 API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({ role: m.role, content: m.content })),
          fileId: currentFile?.id,
          strategyId: currentStrategy?.id,
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let currentContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  currentContent += data.content;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === aiMessageId ? { ...m, content: currentContent } : m
                    )
                  );
                } else if (data.error) {
                  currentContent += `\n\n[错误: ${data.error}]`;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === aiMessageId ? { ...m, content: currentContent } : m
                    )
                  );
                }
              } catch {}
            }
          }
        }
      } else {
        throw new Error('API error');
      }
    } catch (e) {
      // 模拟流式输出（降级方案）
      const mockResponse = `我已收到您的消息："${content}"。\n\n这是一个模拟的 AI 回复。在完整版本中，这里会根据您选择的策略和上传的文件内容进行智能解析和回复。\n\n当前选择的策略：${currentStrategy?.name || '无'}\n当前选择的文件：${currentFile?.name || '无'}`;

      let currentContent = '';
      for (let i = 0; i < mockResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        currentContent += mockResponse[i];
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMessageId ? { ...m, content: currentContent } : m
          )
        );
      }
    }

    // 标记完成
    setMessages(prev =>
      prev.map(m =>
        m.id === aiMessageId ? { ...m, isStreaming: false } : m
      )
    );
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // 设置管理
  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    // 同步到 API
    try {
      const configUpdates: Record<string, string> = {
        main_model: newSettings.mainModel,
        ocr_model: newSettings.ocrModel,
        asr_model: newSettings.asrModel,
        mineru_api_key: newSettings.mineruApiKey,
        parse_mode: newSettings.parseMode,
      };
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configUpdates),
      });
    } catch (e) {
      console.error('Failed to sync settings:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        files,
        currentFile,
        uploadFile,
        selectFile,
        deleteFile,
        isLoadingFiles,
        strategies,
        currentStrategy,
        selectStrategy,
        addStrategy,
        updateStrategy,
        deleteStrategy,
        isLoadingStrategies,
        messages,
        sendMessage,
        clearMessages,
        settings,
        updateSettings,
        isLoadingSettings,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

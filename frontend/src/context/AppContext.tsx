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
  
  // 策略管理
  strategies: Strategy[];
  currentStrategy: Strategy | null;
  selectStrategy: (strategy: Strategy | null) => void;
  addStrategy: (strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'isSystem'>) => void;
  updateStrategy: (id: string, strategy: Partial<Strategy>) => void;
  deleteStrategy: (id: string) => void;
  
  // 聊天管理
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  
  // 设置管理
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  
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

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedFiles = localStorage.getItem('file-parser-files');
    const savedStrategies = localStorage.getItem('file-parser-strategies');
    const savedSettings = localStorage.getItem('file-parser-settings');
    const savedMessages = localStorage.getItem('file-parser-messages');

    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles);
        setFiles(parsed.map((f: any) => ({ ...f, uploadedAt: new Date(f.uploadedAt) })));
      } catch (e) {
        console.error('Failed to load files:', e);
      }
    }

    if (savedStrategies) {
      try {
        const parsed = JSON.parse(savedStrategies);
        const userStrategies = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
        }));
        setStrategies([...SYSTEM_STRATEGIES, ...userStrategies]);
      } catch (e) {
        console.error('Failed to load strategies:', e);
      }
    }

    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error('Failed to load messages:', e);
      }
    }
  }, []);

  // 保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem('file-parser-files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    const userStrategies = strategies.filter(s => !s.isSystem);
    localStorage.setItem('file-parser-strategies', JSON.stringify(userStrategies));
  }, [strategies]);

  useEffect(() => {
    localStorage.setItem('file-parser-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('file-parser-messages', JSON.stringify(messages));
  }, [messages]);

  // 文件管理
  const uploadFile = async (file: File): Promise<void> => {
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
  };

  const selectFile = (file: FileItem | null) => {
    setCurrentFile(file);
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (currentFile?.id === fileId) {
      setCurrentFile(null);
    }
  };

  // 策略管理
  const selectStrategy = (strategy: Strategy | null) => {
    setCurrentStrategy(strategy);
  };

  const addStrategy = (strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'isSystem'>) => {
    const newStrategy: Strategy = {
      ...strategy,
      id: Date.now().toString(),
      isSystem: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStrategies(prev => [...prev, newStrategy]);
  };

  const updateStrategy = (id: string, updates: Partial<Strategy>) => {
    setStrategies(prev =>
      prev.map(s =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
      )
    );
  };

  const deleteStrategy = (id: string) => {
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

    // 模拟 AI 回复（流式输出）
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);

    // 模拟流式输出
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
  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        files,
        currentFile,
        uploadFile,
        selectFile,
        deleteFile,
        strategies,
        currentStrategy,
        selectStrategy,
        addStrategy,
        updateStrategy,
        deleteStrategy,
        messages,
        sendMessage,
        clearMessages,
        settings,
        updateSettings,
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

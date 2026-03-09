'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FileUpload } from '@/components/FileUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { StrategyManager } from '@/components/StrategyManager';
import { SettingsPage } from '@/components/SettingsPage';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { currentPage, currentFile } = useApp();

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

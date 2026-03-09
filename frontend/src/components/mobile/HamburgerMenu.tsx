'use client';

import React from 'react';
import { X, Upload, Trash2, RefreshCw, Info, ExternalLink, FileText, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const { currentFile, files, uploadFile, clearMessages, deleteFile, setCurrentPage } = useApp();

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      await uploadFile(fileList[0]);
    }
    onClose();
  };

  const menuItems = [
    {
      icon: Upload,
      label: '上传新文件',
      onClick: () => document.getElementById('mobile-file-upload')?.click(),
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
    },
    {
      icon: MessageSquare,
      label: '对话页面',
      onClick: () => { setCurrentPage('chat'); onClose(); },
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-100',
    },
    {
      icon: SettingsIcon,
      label: '设置页面',
      onClick: () => { setCurrentPage('settings'); onClose(); },
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      hoverBg: 'hover:bg-purple-100',
    },
  ];

  const dangerItems = currentFile ? [
    {
      icon: Trash2,
      label: '清空对话',
      onClick: () => { clearMessages(); onClose(); },
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100',
    },
    {
      icon: Trash2,
      label: '删除当前文件',
      onClick: () => { deleteFile(currentFile.id); onClose(); },
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100',
    },
  ] : [];

  return (
    <>
      {/* 遮罩层 - 毛玻璃效果 */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        onClick={onClose}
      />

      {/* 菜单面板 - 从右侧滑出，毛玻璃效果 */}
      <div className="fixed top-0 right-0 h-full w-[280px] bg-white/70 backdrop-blur-2xl shadow-2xl z-50 md:hidden animate-slide-in-right">
        {/* 头部 */}
        <div className="p-5 border-b border-gray-200/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">菜单</h2>
              <p className="text-xs text-gray-500">{files.length} 个文件</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 rounded-xl">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* 菜单内容 */}
        <div className="p-4 space-y-2">
          {/* 主要操作 */}
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`
                w-full flex items-center gap-3.5 p-3.5 rounded-xl 
                ${item.bgColor} ${item.hoverBg} transition-all duration-200
                border border-transparent hover:border-current/10
              `}
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-sm`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <span className={`font-medium ${item.textColor}`}>{item.label}</span>
            </button>
          ))}

          {/* 危险操作 */}
          {dangerItems.length > 0 && (
            <>
              <div className="border-t border-gray-200/50 my-4" />
              <p className="text-xs font-medium text-gray-400 px-2 mb-2">危险操作</p>
              {dangerItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`
                    w-full flex items-center gap-3.5 p-3.5 rounded-xl 
                    ${item.bgColor} ${item.hoverBg} transition-all duration-200
                    border border-transparent hover:border-current/10
                  `}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-sm`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className={`font-medium ${item.textColor}`}>{item.label}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200/50">
          <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-600 mb-1">文件解析助手</p>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </div>
        </div>
      </div>
      
      {/* 隐藏的文件上传输入 */}
      <input
        type="file"
        id="mobile-file-upload"
        className="hidden"
        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.json,.jpg,.jpeg,.png,.txt"
        onChange={handleFileUpload}
      />
    </>
  );
}

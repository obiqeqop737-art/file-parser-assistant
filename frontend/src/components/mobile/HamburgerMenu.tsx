'use client';

import React from 'react';
import { X, Upload, Trash2, RefreshCw, Info, ExternalLink } from 'lucide-react';
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

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {/* 菜单面板 */}
      <div className="fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-50 md:hidden animate-slide-in">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">更多选项</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 菜单内容 */}
        <div className="p-4 space-y-3">
          {/* 上传文件 */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors">
            <Upload className="h-5 w-5" />
            <span className="font-medium">上传新文件</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.json,.jpg,.jpeg,.png,.txt"
              onChange={handleFileUpload}
            />
          </label>

          {/* 清空对话 */}
          {currentFile && (
            <button
              onClick={() => {
                clearMessages();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
              <span className="font-medium">清空对话</span>
            </button>
          )}

          {/* 删除当前文件 */}
          {currentFile && (
            <button
              onClick={() => {
                deleteFile(currentFile.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
              <span className="font-medium">删除当前文件</span>
            </button>
          )}

          {/* 分隔线 */}
          <div className="border-t border-gray-100 my-4" />

          {/* 关于 */}
          <button
            onClick={() => {
              setCurrentPage('settings');
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Info className="h-5 w-5" />
            <span className="font-medium">设置</span>
          </button>

          {/* 帮助文档（占位） */}
          <div className="p-3 rounded-xl bg-gray-50 text-gray-500">
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4" />
              <span>查看帮助文档</span>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            文件解析助手 v1.0
          </p>
        </div>
      </div>
    </>
  );
}

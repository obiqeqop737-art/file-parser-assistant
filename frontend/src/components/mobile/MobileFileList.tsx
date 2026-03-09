'use client';

import React from 'react';
import { FileText, ChevronDown, ChevronUp, Upload, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MobileFileListProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function MobileFileList({ isExpanded, onToggle }: MobileFileListProps) {
  const { files, currentFile, selectFile, deleteFile, uploadFile, setCurrentPage } = useApp();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    let colorClass = 'text-gray-500';
    switch (ext) {
      case 'pdf':
        colorClass = 'text-red-500';
        break;
      case 'docx':
      case 'doc':
        colorClass = 'text-blue-500';
        break;
      case 'xlsx':
      case 'xls':
      case 'csv':
        colorClass = 'text-green-500';
        break;
      case 'json':
        colorClass = 'text-yellow-500';
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
        colorClass = 'text-purple-500';
        break;
    }
    return <FileText className={cn('h-4 w-4', colorClass)} />;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      await uploadFile(fileList[0]);
    }
  };

  return (
    <div 
      className={cn(
        'absolute bottom-20 left-2 right-2 transition-all duration-300 ease-in-out',
        isExpanded 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 max-h-[45vh] overflow-hidden">
        {/* 头部 */}
        <div className="p-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xl z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">文件列表</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {files.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* 上传按钮 */}
            <label className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Upload className="h-4 w-4 text-gray-500" />
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.json,.jpg,.jpeg,.png,.txt"
                onChange={handleFileUpload}
              />
            </label>
            {/* 收起按钮 */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* 文件列表 */}
        <ScrollArea className="max-h-[calc(45vh-60px)]">
          {files.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-3">暂无文件</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-600 transition-colors">
                <Upload className="h-4 w-4" />
                <span className="text-sm">上传文件</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.json,.jpg,.jpeg,.png,.txt"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    'group p-3 rounded-xl cursor-pointer transition-all',
                    currentFile?.id === file.id
                      ? 'bg-blue-500/10 border border-blue-500/20'
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => selectFile(file)}
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                    {currentFile?.id === file.id && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        当前
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

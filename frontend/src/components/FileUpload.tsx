'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SUPPORTED_EXTENSIONS } from '@/types';

interface FileUploadProps {
  className?: string;
}

export function FileUpload({ className }: FileUploadProps) {
  const { uploadFile } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext || '')) {
      setError(`不支持的文件格式。支持的格式：${SUPPORTED_EXTENSIONS.join(', ')}`);
      return false;
    }

    // 限制文件大小为 50MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('文件大小不能超过 50MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;
      await uploadFile(file);
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await handleFile(files[0]);
      }
      // 重置 input 以便可以再次选择同一文件
      e.target.value = '';
    },
    [handleFile]
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-6 md:p-8 transition-all duration-300 cursor-pointer',
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-300 bg-white/50 hover:border-blue-400 hover:bg-white/70',
          'glass-card'
        )}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept={SUPPORTED_EXTENSIONS.join(',')}
        />

        <div className="text-center">
          <div className={cn(
            'w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-2xl flex items-center justify-center transition-colors',
            isDragging ? 'bg-blue-500/20' : 'bg-gray-100'
          )}>
            <Upload className={cn(
              'h-7 w-7 md:h-8 md:w-8',
              isDragging ? 'text-blue-500' : 'text-gray-400'
            )} />
          </div>

          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-1 md:mb-2">
            {isDragging ? '松开上传文件' : '上传文件'}
          </h3>
          <p className="text-sm text-gray-500 mb-3 md:mb-4">
            {isMobile ? '点击选择文件' : '拖拽文件到此处，或点击选择文件'}
          </p>

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 text-xs text-gray-400">
            {SUPPORTED_EXTENSIONS.map((ext) => (
              <span
                key={ext}
                className="px-2 py-1 bg-gray-100 rounded-md"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

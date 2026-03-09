/**
 * 文件解析助手 - TypeScript 类型定义
 */

// 文件类型
export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'pending' | 'parsing' | 'completed' | 'failed';
  content?: string;
  parseResult?: string;
}

// 策略类型
export interface Strategy {
  id: string;
  name: string;
  description: string;
  content: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// 设置类型
export interface Settings {
  mainModel: string;
  ocrModel: string;
  asrModel: string;
  mineruApiKey: string;
  parseMode: 'default' | 'mineru';
  customApiKeys: {
    [key: string]: string;
  };
}

// 系统预设策略
export const SYSTEM_STRATEGIES: Strategy[] = [
  {
    id: 'universal-expert',
    name: '全能文件解析专家',
    description: '通用型深度解析，适用于各种文档类型',
    content: '你是一个全能文件解析专家。请对该文档进行深度研读，并严格按以下格式输出：1. [文件概览]：用三句话精准总结文档核心内容。2. [文件脉络]：以 Markdown 列表形式列出文档的主要章节和逻辑结构大纲。3. [详细解析]：根据文档内容对用户的提问进行专业解答。',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'logistics-expert',
    name: '物流文件解析助手',
    description: '运单、装箱单、发票等物流单证解析',
    content: '你是一个资深的物流单证解析专家。请重点识别文档中的：运单号、发货人/收货人信息、物料描述、件数/毛重/体积、港口信息以及贸易条款。请按结构化表格输出关键物流参数。',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'factory-expert',
    name: '工厂文件解析专家',
    description: 'SOP、BOM、设备规格等工厂文档解析',
    content: '你是一个精通工厂设备管理和生产流程的专家。请重点分析文档中的技术参数、物料清单(BOM)、操作标准程序(SOP)以及安全生产规范。',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 预设模型列表
export const MAIN_MODELS = [
  { id: 'deepseek-ai/DeepSeek-V3.2', name: 'DeepSeek V3.2' },
  { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 72B' },
  { id: 'THUDM/glm-4-9b-chat', name: 'GLM-4-9B' },
];

export const OCR_MODELS = [
  { id: 'Qwen/Qwen3-VL-8B-Instruct', name: 'Qwen3-VL 8B' },
  { id: 'THUDM/glm-4v-9b', name: 'GLM-4V-9B' },
];

export const ASR_MODELS = [
  { id: 'TeleAI/TeleSpeechASR', name: '讯飞语音识别' },
  { id: 'FunAudioLLM/SenseVoiceLarge', name: 'SenseVoice Large' },
];

// 支持的文件类型
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'text/plain',
  'application/json',
  'image/jpeg',
  'image/png',
];

export const SUPPORTED_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.xlsx',
  '.xls',
  '.csv',
  '.txt',
  '.json',
  '.jpg',
  '.jpeg',
  '.png',
];

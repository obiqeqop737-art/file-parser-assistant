# 文件解析助手 - 产品需求文档 (PRD)

> **文档版本**：v1.5  
> **更新日期**：2026-03-09  
> **产品经理**：AI PM

---

## 1. 产品概述

### 1.1 产品定位
文件解析助手是一个面向企业的**智能文件分析 SaaS 平台**，支持通用文档、工厂文件、物流文件的解析与分析。用户可自定义解读策略，满足个性化需求。

### 1.2 目标用户
- 企业内部员工（不同部门）
- 工厂管理人员、物流操作人员
- 需要定制化文档解析方案的专业用户

### 1.3 核心价值
- **多用户协作**：企业级平台，支持部门隔离和团队共享
- **自动化解析**：减少人工处理时间，智能提取关键信息
- **自定义策略**：满足个性化解析需求
- **策略市场**：像 App Store 一样分享和发现优质策略
- **审计合规**：完整日志记录，支持数据导出和合规要求

---

## 2. 功能需求

### 2.1 用户与认证

#### 2.1.1 注册与登录
| 功能 | 描述 |
|------|------|
| **邮箱注册** | 邮箱 + 密码注册 |
| **邮箱登录** | 邮箱 + 密码登录 |
| **会话管理** | Token 鉴权，支持 Session/Cookie |

#### 2.1.2 用户信息
| 功能 | 描述 |
|------|------|
| **个人资料** | 头像、昵称、部门 |
| **修改密码** | 登录后修改密码 |
| **我的 API** | 查看和管理自己的 API 配置 |

---

### 2.2 权限体系

#### 2.2.1 角色定义
| 角色 | 权限范围 |
|------|----------|
| **普通员工** | 上传文件、解析、使用策略、创建个人策略、管理自己的数据 |
| **部门管理员** | 管理本部门用户、查看本部门统计、管理本部门策略 |
| **超级管理员** | 管理所有用户、查看全局统计、平台配置、策略管理 |

#### 2.2.2 管理员功能
| 功能 | 部门管理员 | 超级管理员 |
|------|:--------:|:--------:|
| **用户管理** | 本部门 | 全部 |
| **配额设置** | 本部门 | 全部 |
| **默认模型配置** | ❌ | ✅ |
| **策略管理** | 本部门 | 全部 |
| **全局统计** | ❌ | ✅ |
| **系统配置** | ❌ | ✅ |

---

### 2.3 配额管理

#### 2.3.1 配额类型
| 配额项 | 说明 |
|--------|------|
| **解析次数** | 每日/每月可解析的文件数量 |
| **存储空间** | 用户可使用的文件存储上限 |
| **文件大小** | 单次上传文件大小限制 |

#### 2.3.2 配额配置（管理员）
| 配置项 | 说明 |
|--------|------|
| **全局默认** | 所有新用户的默认配额 |
| **用户级别** | 可为不同用户设置不同配额 |
| **超额处理** | 超额后提示或降级服务 |

---

### 2.4 数据存储与清理

#### 2.4.1 存储策略
| 功能 | 描述 |
|------|------|
| **文件存储** | 上传的文件加密存储在公司机房 |
| **数据库** | MySQL/PostgreSQL 存储用户数据 |
| **结果缓存** | 解析结果缓存，支持快速查看 |

#### 2.4.2 自动清理
| 功能 | 描述 |
|------|------|
| **过期清理** | 上传后 7 天自动删除文件 |
| **手动清理** | 用户可手动删除自己的文件 |
| **管理员清理** | 管理员可批量清理历史文件 |

---

### 2.5 访问日志

#### 2.5.1 用户操作日志
| 操作类型 | 记录内容 |
|----------|----------|
| 文件上传 | 用户 ID、文件名、上传时间 |
| 文件解析 | 用户 ID、文件名、策略、解析时间 |
| 文件删除 | 用户 ID、文件名、删除时间 |
| 配置修改 | 用户 ID、修改内容、修改时间 |

#### 2.5.2 管理员操作日志
| 操作类型 | 记录内容 |
|----------|----------|
| 用户管理 | 管理员 ID、操作用户、具体操作 |
| 配额修改 | 管理员 ID、被修改用户、配额变更 |
| 模型配置 | 管理员 ID、修改的配置项 |

---

### 2.6 审计合规

#### 2.6.1 数据导出
| 功能 | 描述 |
|------|------|
| **我的数据导出** | 用户可导出自己的所有数据（JSON/CSV） |
| **管理员导出** | 管理员可导出指定用户/全部用户数据 |

#### 2.6.2 数据删除
| 功能 | 描述 |
|------|------|
| **用户自删** | 用户可删除自己的账号及全部数据 |
| **管理员删除** | 管理员可删除指定用户及数据 |
| **批量删除** | 管理员可批量清理过期/违规数据 |

---

### 2.7 解读策略功能

#### 2.7.1 系统预设策略
| 策略ID | 策略名称 | 适用场景 |
|--------|----------|----------|
| universal-expert | 全能文件解析专家 | 通用型深度解析 |
| logistics-expert | 物流文件解析助手 | 运单、装箱单、发票 |
| factory-expert | 工厂文件解析专家 | SOP、BOM、设备规格 |
| speech-expert | 语音文件转译专家 | ASR 语音转文本 |

#### 2.7.2 用户自定义策略
| 功能 | 描述 |
|------|------|
| **添加策略** | 创建新的解读策略 |
| **编辑策略** | 修改策略内容 |
| **删除策略** | 删除个人策略 |
| **克隆策略** | 复制现有策略 |

#### 2.7.3 策略作用域
| 类型 | 可见范围 | 管理权限 |
|------|----------|----------|
| **公开策略** | 全公司可见 | 管理员管理 |
| **部门策略** | 本部门可见 | 部门管理员创建 |
| **个人策略** | 仅自己可见 | 个人管理 |

---

### 2.8 策略市场（Marketplace）

#### 2.8.1 市场功能
| 功能 | 描述 |
|------|------|
| **策略广场** | 浏览所有公开策略 |
| **搜索筛选** | 按名称、标签、分类搜索 |
| **评分系统** | 1-5 星评分 + 评论 |
| **收藏功能** | 收藏常用策略 |
| **使用统计** | 显示策略使用次数 |

#### 2.8.2 策略发布
| 功能 | 描述 |
|------|------|
| **提交发布** | 用户可提交个人策略到市场 |
| **审核机制** | 管理员审核后公开 |
| **版本更新** | 策略作者可更新版本 |

---

### 2.9 AI 模型配置

#### 2.9.1 平台默认模型（管理员配置）
| 模型类型 | 默认模型 |
|-----------|----------|
| **主模型** | deepseek-ai/DeepSeek-V3.2 |
| **OCR 模型** | Qwen/Qwen3-VL-8B-Instruct |
| **ASR 模型** | TeleAI/TeleSpeechASR |

#### 2.9.2 用户自选模型
| 功能 | 描述 |
|------|------|
| **使用默认** | 使用平台配置的默认模型 |
| **自定义 API** | 用户可填入自己的 API Key |
| **模型切换** | 解析时选择使用哪个模型 |

#### 2.9.3 预设模型列表
**主模型**：
| 模型 ID | 名称 |
|---------|------|
| deepseek-ai/DeepSeek-V3.2 | DeepSeek V3.2 |
| Qwen/Qwen2.5-72B-Instruct | Qwen 2.5 72B |
| THUDM/glm-4-9b-chat | GLM-4-9B |

**OCR 模型**：
| 模型 ID | 名称 |
|---------|------|
| Qwen/Qwen3-VL-8B-Instruct | Qwen3-VL 8B |
| THUDM/glm-4v-9b | GLM-4V-9B |

**ASR 模型**：
| 模型 ID | 名称 |
|---------|------|
| TeleAI/TeleSpeechASR | 讯飞语音识别 |
| FunAudioLLM/SenseVoiceLarge | SenseVoice Large |

---

### 2.10 文件解析功能

#### 2.10.1 支持格式
- **文档**：PDF、Word (.docx)、TXT、JSON
- **表格**：Excel (.xlsx, .xls)、CSV
- **图片**：JPG、PNG（OCR 识别）
- **音视频**：MP3、WAV（ASR 转写）

#### 2.10.2 解析类型
| 类型 | 功能 |
|------|------|
| **通用解析** | 全能文件解析专家 |
| **工厂解析** | 生产数据、质量报告、设备日志 |
| **物流解析** | 运单、报关单、装箱单、发票 |
| **语音转写** | 音频/视频转文本 |

#### 2.10.3 PDF 解析模式（新增）
用户可选择不同的 PDF 解析策略：

| 模式 | 名称 | 技术方案 | 适用场景 |
|------|------|----------|----------|
| **A** | 默认方案 | pdfplumber → OCR 回退 → 分片处理 | 普通文字 PDF、表格、扫描件 |
| **B** | MinerU 增强 | MinerU API（布局分析 + OCR） | 复杂排版、学术论文、多栏文档 |

**模式 A：默认方案（免费）**
```
1. 先用 pdfplumber 提取文本
   ↓ 文本量 < 阈值（如 100 字符）
2. 自动触发 OCR（PaddleOCR-VL）
   ↓ 页数 > 50 页
3. 分页处理（每 10 页一批）
   ↓ 文件 > 50MB
4. 异步队列 + 进度通知
```

**模式 B：MinerU 增强（需 API）**
- 使用 MinerU API 进行深度解析
- 自动布局分析（标题、段落、表格、公式）
- 更强的 OCR 能力
- 输出 Markdown/JSON 格式
- **不支持加密/密码保护的 PDF**

**模式选择界面**
| 设置项 | 说明 |
|--------|------|
| 解析模式 | 下拉选择：A 默认 / B MinerU |
| MinerU API Key | 用户可填入自己的 Key（可选） |
| 大文件处理 | 自动分片 / 异步队列 |

#### 2.10.4 PPT/PPTX 支持（待开发）
| 方案 | 说明 |
|------|------|
| python-pptx | 读取文本、图表 |
| 转 PDF + MinerU | 复杂 PPT 使用 MinerU 解析 |

---

### 2.11 其他功能
- 文件上传与管理
- 解析历史记录
- 结果导出（Excel/CSV/PDF）
- 批量处理

### 2.12 站内通知

#### 2.12.1 通知类型
| 类型 | 触发场景 | 接收人 |
|------|----------|--------|
| **解析完成** | 文件解析完成 | 上传者 |
| **解析失败** | 解析异常/超时 | 上传者 |
| **配额预警** | 剩余配额 < 20% | 用户 |
| **策略审核** | 策略通过/拒绝 | 策略作者 |
| **系统公告** | 平台更新/维护 | 全部用户 |

#### 2.12.2 通知渠道
| 渠道 | 说明 |
|------|------|
| **站内信** | 应用内通知中心 |
| **邮件通知** | 可选，管理员开启 |

---

### 2.13 文件分享

#### 2.13.1 分享功能
| 功能 | 描述 |
|------|------|
| **分享链接** | 生成链接，可设置有效期 |
| **权限设置** | 可查看 / 可下载 |
| **分享记录** | 查看谁访问了我的分享 |

#### 2.13.2 协作功能
| 功能 | 描述 |
|------|------|
| **团队文件** | 部门共享文件夹 |
| **协作编辑** | 多人同时解析同一文件 |

---

### 2.14 批量处理

#### 2.14.1 批量上传
| 功能 | 描述 |
|------|------|
| **多文件上传** | 一次选择多个文件 |
| **文件夹上传** | 支持整个文件夹 |
| **队列显示** | 显示上传进度 |

#### 2.14.2 批量解析
| 功能 | 描述 |
|------|------|
| **批量任务** | 一次解析多个文件 |
| **任务队列** | 查看等待中的任务 |
| **批量结果** | 批量导出解析结果 |

---

## 3. 数据库设计

### 3.1 核心数据表

#### 用户表
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  department_id VARCHAR(36),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  daily_quota INT DEFAULT 100,
  monthly_quota INT DEFAULT 1000,
  storage_quota BIGINT DEFAULT 1073741824, -- 1GB
  storage_used BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 部门表
```sql
CREATE TABLE departments (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 文件表
```sql
CREATE TABLE files (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(50),
  file_path VARCHAR(500),
  strategy_id VARCHAR(36),
  parse_result TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP, -- 7天后过期
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 策略表
```sql
CREATE TABLE strategies (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author_id VARCHAR(36),
  scope ENUM('system', 'public', 'department', 'private') DEFAULT 'private',
  department_id VARCHAR(36),
  is_approved BOOLEAN DEFAULT FALSE,
  star_count INT DEFAULT 0,
  use_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 策略评分表
```sql
CREATE TABLE strategy_ratings (
  id VARCHAR(36) PRIMARY KEY,
  strategy_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (strategy_id) REFERENCES strategies(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 操作日志表
```sql
CREATE TABLE operation_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(36),
  detail TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API 配置表
```sql
CREATE TABLE api_configs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  config_type ENUM('main', 'ocr', 'asr') NOT NULL,
  provider VARCHAR(50) DEFAULT 'siliconflow',
  model_id VARCHAR(100),
  api_key VARCHAR(255), -- 加密存储
  base_url VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 通知表
```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('parse_complete', 'parse_failed', 'quota_warning', 'strategy_approved', 'strategy_rejected', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 文件分享表
```sql
CREATE TABLE file_shares (
  id VARCHAR(36) PRIMARY KEY,
  file_id VARCHAR(36) NOT NULL,
  owner_id VARCHAR(36) NOT NULL,
  share_token VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  permission ENUM('view', 'download') DEFAULT 'view',
  access_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

#### MinerU 配置表
```sql
CREATE TABLE mineru_configs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  api_key VARCHAR(255), -- 加密存储
  is_global BOOLEAN DEFAULT FALSE, -- 平台全局配置
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 4. API 设计

### 认证
```
POST   /api/auth/register      # 注册
POST   /api/auth/login          # 登录
POST   /api/auth/logout         # 登出
GET    /api/auth/me             # 当前用户信息
```

### 用户
```
GET    /api/users               # 用户列表（管理员）
GET    /api/users/:id           # 用户详情
PATCH  /api/users/:id           # 修改用户
DELETE /api/users/:id           # 删除用户（管理员）
POST   /api/users/:id/reset-pwd # 重置密码（管理员）
```

### 文件
```
POST   /api/files/upload        # 上传文件
GET    /api/files               # 文件列表
GET    /api/files/:id           # 文件详情
DELETE /api/files/:id           # 删除文件
POST   /api/files/:id/parse     # 解析文件
GET    /api/files/:id/result    # 解析结果
```

### 策略
```
GET    /api/strategies                   # 策略列表
POST   /api/strategies                   # 创建策略
GET    /api/strategies/:id               # 策略详情
PATCH  /api/strategies/:id               # 修改策略
DELETE /api/strategies/:id               # 删除策略
POST   /api/strategies/:id/publish       # 发布到市场
POST   /api/strategies/:id/rate          # 评分
GET    /api/strategies/:id/ratings       # 评分列表
```

### 模型配置
```
GET    /api/models/default               # 获取平台默认模型
GET    /api/models/config                 # 我的 API 配置
POST   /api/models/config                 # 添加 API 配置
PATCH  /api/models/config/:id             # 修改 API 配置
DELETE /api/models/config/:id             # 删除 API 配置
```

### 管理
```
GET    /api/admin/stats                   # 全局统计
GET    /api/admin/logs                    # 操作日志
POST   /api/admin/quota                   # 设置配额
GET    /api/admin/pending-strategies       # 待审核策略
POST   /api/strategies/:id/approve       # 审核通过
```

### 数据
```
GET    /api/data/export                   # 导出我的数据（用户）
POST   /api/admin/export                  # 导出用户数据（管理员）
DELETE /api/data/account                  # 删除我的账号
```

### 通知
```
GET    /api/notifications                 # 我的通知列表
PATCH  /api/notifications/:id             # 标记已读
POST   /api/notifications/read-all        # 全部标记已读
```

### 分享
```
POST   /api/files/:id/share               # 分享文件
GET    /api/files/:id/shares              # 查看分享列表
DELETE /api/shares/:id                    # 取消分享
GET    /api/shares/:token                 # 通过链接访问
```

---

## 5. UI/UX 设计

### 5.1 页面结构
| 页面 | 说明 |
|------|------|
| **登录/注册** | 账号密码入口 |
| **工作台** | 今日解析概览、快速入口 |
| **智能解析** | 主页面，文件上传 + AI 对话 |
| **策略市场** | 公开策略浏览、搜索、评分 |
| **我的策略** | 个人/部门策略管理 |
| **历史记录** | 解析历史、结果查看 |
| **通知中心** | 系统通知、审核状态 |
| **文件分享** | 我的分享、收到的分享 |
| **设置** | 个人资料、API 配置、配额查看 |
| **管理后台** | 用户管理、策略审核、统计分析（仅管理员） |

### 5.2 设计风格
| 属性 | 描述 |
|------|------|
| **主色调** | 蓝色 (#217.2 91% 60%) + 白色 |
| **辅助色** | 青色渐变 |
| **质感** | 液态玻璃 (Glassmorphism) |

---

## 6. 技术架构

### 6.1 前端
- Next.js 15+ (App Router)
- React 19+
- Tailwind CSS + shadcn/ui

### 6.2 后端
- Node.js / Python (Flask/FastAPI)
- MySQL / PostgreSQL
- Redis（缓存、会话）

### 6.3 AI 服务
- SiliconFlow API（主模型、OCR、ASR）
- 支持自定义 API

### 6.4 存储
- 本地存储 / 对象存储（MinIO）
- 文件加密存储

---

## 7. 项目里程碑

| 版本 | 内容 | 说明 |
|------|------|------|
| v1.0 | 基础解析功能 | 单用户，文件解析基础能力 |
| v1.1 | 自定义策略 | 个人策略管理 |
| v1.2 | AI 模型选择 | 用户可选主模型/OCR/ASR |
| v1.3 | 多用户系统 | 用户注册、登录、权限 |
| v1.4 | **PDF 解析模式** | **A 默认方案 / B MinerU 增强** |
| v2.0 | 配额与日志 | 配额管理、访问日志、7天清理 |
| v2.1 | 策略市场 | 公开/部门/个人策略、评分、审核 |
| v2.2 | 审计合规 | 数据导出、账号删除、管理后台 |

---

## 8. 成功指标

| 指标 | 目标 |
|------|------|
| 文件解析准确率 | > 90% |
| 策略市场使用率 | > 40% |
| 用户满意度 | > 4.5/5 |
| 日活用户 | > 500 |

---

## 9. 附录

### 9.1 术语表

| 术语 | 定义 |
|------|------|
| 解读策略 | AI 解析文件的系统提示词配置 |
| 策略市场 | 公开分享和发现策略的平台 |
| 配额管理 | 限制用户解析次数和存储空间 |
| 审计合规 | 日志记录、数据导出、账号删除 |
| Glassmorphism | 液态玻璃质感设计风格 |

---

**文档版本**：v1.5  
**编写日期**：2026-03-09  
**产品经理**：AI PM

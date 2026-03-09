# File Parser Assistant - Backend

文件解析助手后端服务

## 技术栈

- Python 3.8+
- Flask 3.0
- SQLite
- pdfplumber (PDF 解析)
- python-docx (Word 解析)
- openpyxl + pandas (Excel 解析)

## 安装

```bash
cd backend
pip install -r requirements.txt
```

## 启动

```bash
python app.py
```

服务将在 http://localhost:5000 启动

## API 文档

### 配置 API

- `GET /api/config` - 获取配置
- `POST /api/config` - 更新配置

### 文件 API

- `GET /api/files` - 获取文件列表
- `POST /api/files/upload` - 上传文件
- `GET /api/files/<id>` - 获取文件详情
- `DELETE /api/files/<id>` - 删除文件
- `POST /api/files/<id>/parse` - 解析文件

### 策略 API

- `GET /api/strategies` - 获取策略列表
- `POST /api/strategies` - 创建策略
- `PATCH /api/strategies/<id>` - 更新策略
- `DELETE /api/strategies/<id>` - 删除策略

### Chat API

- `POST /api/chat` - 流式聊天

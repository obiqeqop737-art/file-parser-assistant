#!/bin/bash

# 文件解析助手后端启动脚本

echo "=========================================="
echo "  文件解析助手 - 后端服务"
echo "=========================================="
echo ""

# 检查 Python 是否可用
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到 python3，请先安装 Python 3.8+"
    exit 1
fi

# 进入脚本所在目录
cd "$(dirname "$0")"

# 检查数据库是否存在，如果不存在则初始化
if [ ! -f "file_parser.db" ]; then
    echo "初始化数据库..."
    python3 -c "from database import init_db; init_db()"
fi

# 设置 API keys
echo "配置 API keys..."
python3 setup_config.py

echo ""
echo "启动 Flask 后端服务..."
echo "服务地址: http://localhost:5000"
echo "按 Ctrl+C 停止服务"
echo "=========================================="
echo ""

python3 app.py

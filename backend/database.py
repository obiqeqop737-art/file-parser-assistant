import sqlite3
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), 'file_parser.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 文件表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS files (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            size INTEGER NOT NULL,
            type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            content TEXT,
            parse_result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 策略表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS strategies (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            content TEXT NOT NULL,
            is_system BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 配置表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 插入默认配置
    default_configs = [
        ('main_model', 'deepseek-ai/DeepSeek-V3.2'),
        ('ocr_model', 'Qwen/Qwen3-VL-8B-Instruct'),
        ('asr_model', 'TeleAI/TeleSpeechASR'),
        ('siliconflow_api_key', ''),
        ('mineru_api_key', ''),
        ('parse_mode', 'default'),
    ]
    
    for key, value in default_configs:
        cursor.execute('INSERT OR IGNORE INTO configs (key, value) VALUES (?, ?)', (key, value))
    
    # 插入系统预设策略
    system_strategies = [
        (
            'universal-expert',
            '全能文件解析专家',
            '通用型深度解析，适用于各种文档类型',
            '你是一个全能文件解析专家。请对该文档进行深度研读，并严格按以下格式输出：1. [文件概览]：用三句话精准总结文档核心内容。2. [文件脉络]：以 Markdown 列表形式列出文档的主要章节和逻辑结构大纲。3. [详细解析]：根据文档内容对用户的提问进行专业解答。',
            1
        ),
        (
            'logistics-expert',
            '物流文件解析助手',
            '运单、装箱单、发票等物流单证解析',
            '你是一个资深的物流单证解析专家。请重点识别文档中的：运单号、发货人/收货人信息、物料描述、件数/毛重/体积、港口信息以及贸易条款。请按结构化表格输出关键物流参数。',
            1
        ),
        (
            'factory-expert',
            '工厂文件解析专家',
            'SOP、BOM、设备规格等工厂文档解析',
            '你是一个精通工厂设备管理和生产流程的专家。请重点分析文档中的技术参数、物料清单(BOM)、操作标准程序(SOP)以及安全生产规范。',
            1
        ),
    ]
    
    for strat_id, name, desc, content, is_system in system_strategies:
        cursor.execute('''
            INSERT OR IGNORE INTO strategies (id, name, description, content, is_system)
            VALUES (?, ?, ?, ?, ?)
        ''', (strat_id, name, desc, content, is_system))
    
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# 初始化数据库
if not os.path.exists(DB_PATH):
    init_db()

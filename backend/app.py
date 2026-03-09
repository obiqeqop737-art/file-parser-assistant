from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import os
import uuid
import json
from datetime import datetime
import base64
import requests
from database import get_db_connection, init_db

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 初始化数据库
init_db()

# ==================== 配置 API ====================

@app.route('/api/config', methods=['GET'])
def get_config():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT key, value FROM configs')
    configs = {row['key']: row['value'] for row in cursor.fetchall()}
    conn.close()
    return jsonify(configs)

@app.route('/api/config', methods=['POST'])
def update_config():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    for key, value in data.items():
        cursor.execute('''
            INSERT OR REPLACE INTO configs (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
        ''', (key, value))
    
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# ==================== 文件 API ====================

@app.route('/api/files', methods=['GET'])
def get_files():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM files ORDER BY created_at DESC')
    files = []
    for row in cursor.fetchall():
        files.append({
            'id': row['id'],
            'name': row['name'],
            'size': row['size'],
            'type': row['type'],
            'status': row['status'],
            'uploadedAt': row['created_at'],
        })
    conn.close()
    return jsonify(files)

@app.route('/api/files/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    file_id = str(uuid.uuid4())
    filename = file.filename
    file_ext = os.path.splitext(filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = os.path.join(UPLOAD_FOLDER, saved_filename)
    
    file.save(file_path)
    
    file_size = os.path.getsize(file_path)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO files (id, name, size, type, file_path, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (file_id, filename, file_size, file.content_type, file_path, 'pending'))
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': file_id,
        'name': filename,
        'size': file_size,
        'type': file.content_type,
        'status': 'pending',
        'uploadedAt': datetime.now().isoformat()
    })

@app.route('/api/files/<file_id>', methods=['GET'])
def get_file(file_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM files WHERE id = ?', (file_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return jsonify({'error': 'File not found'}), 404
    
    return jsonify({
        'id': row['id'],
        'name': row['name'],
        'size': row['size'],
        'type': row['type'],
        'status': row['status'],
        'content': row['content'],
        'parseResult': row['parse_result'],
        'uploadedAt': row['created_at'],
    })

@app.route('/api/files/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT file_path FROM files WHERE id = ?', (file_id,))
    row = cursor.fetchone()
    
    if row and row['file_path'] and os.path.exists(row['file_path']):
        os.remove(row['file_path'])
    
    cursor.execute('DELETE FROM files WHERE id = ?', (file_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

# ==================== 文件解析 API ====================

@app.route('/api/files/<file_id>/parse', methods=['POST'])
def parse_file(file_id):
    data = request.json or {}
    strategy_id = data.get('strategyId')
    parse_mode = data.get('parseMode', 'default')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM files WHERE id = ?', (file_id,))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        return jsonify({'error': 'File not found'}), 404
    
    # 更新状态为解析中
    cursor.execute('UPDATE files SET status = ? WHERE id = ?', ('parsing', file_id))
    conn.commit()
    
    file_path = row['file_path']
    file_type = row['type']
    
    try:
        content = ''
        
        # 根据文件类型解析
        if file_type == 'application/pdf' or row['name'].lower().endswith('.pdf'):
            content = parse_pdf(file_path, parse_mode, cursor)
        elif row['name'].lower().endswith('.docx'):
            content = parse_docx(file_path)
        elif row['name'].lower().endswith(('.xlsx', '.xls', '.csv')):
            content = parse_spreadsheet(file_path)
        elif row['name'].lower().endswith(('.txt', '.json')):
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        elif file_type.startswith('image/'):
            content = parse_image(file_path, cursor)
        
        # 更新文件内容和状态
        cursor.execute('''
            UPDATE files SET content = ?, status = ?, parse_result = ?
            WHERE id = ?
        ''', (content, 'completed', '', file_id))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'content': content
        })
        
    except Exception as e:
        cursor.execute('UPDATE files SET status = ? WHERE id = ?', ('failed', file_id))
        conn.commit()
        conn.close()
        return jsonify({'error': str(e)}), 500

def parse_pdf(file_path, mode, cursor):
    import pdfplumber
    
    # 先尝试用 pdfplumber 提取
    text = ''
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ''
                text += page_text + '\n\n'
    except Exception as e:
        text = f'pdfplumber 提取失败: {str(e)}'
    
    # 如果文本太少，尝试 OCR
    if len(text.strip()) < 100:
        text += '\n\n[OCR 模式触发]'
        text += parse_image_ocr(file_path, cursor)
    
    return text

def parse_docx(file_path):
    from docx import Document
    doc = Document(file_path)
    text = ''
    for para in doc.paragraphs:
        text += para.text + '\n'
    return text

def parse_spreadsheet(file_path):
    import pandas as pd
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
    return df.to_string()

def parse_image(file_path, cursor):
    return parse_image_ocr(file_path, cursor)

def parse_image_ocr(file_path, cursor):
    # 获取配置
    cursor.execute('SELECT key, value FROM configs')
    configs = {row['key']: row['value'] for row in cursor.fetchall()}
    
    api_key = configs.get('siliconflow_api_key', '')
    ocr_model = configs.get('ocr_model', 'Qwen/Qwen3-VL-8B-Instruct')
    
    if not api_key:
        return '[需要配置 SiliconFlow API Key 才能使用 OCR]'
    
    try:
        # 读取图片并 base64 编码
        with open(file_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        # 调用 SiliconFlow OCR API
        url = 'https://api.siliconflow.cn/v1/chat/completions'
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': ocr_model,
            'messages': [
                {
                    'role': 'user',
                    'content': [
                        {'type': 'text', 'text': '请识别这张图片中的所有文字内容，按原文顺序输出。'},
                        {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{image_data}'}}
                    ]
                }
            ],
            'max_tokens': 2000
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        
        return result['choices'][0]['message']['content']
        
    except Exception as e:
        return f'[OCR 失败: {str(e)}]'

# ==================== 策略 API ====================

@app.route('/api/strategies', methods=['GET'])
def get_strategies():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM strategies ORDER BY is_system DESC, created_at DESC')
    strategies = []
    for row in cursor.fetchall():
        strategies.append({
            'id': row['id'],
            'name': row['name'],
            'description': row['description'],
            'content': row['content'],
            'isSystem': bool(row['is_system']),
            'createdAt': row['created_at'],
            'updatedAt': row['updated_at'],
        })
    conn.close()
    return jsonify(strategies)

@app.route('/api/strategies', methods=['POST'])
def create_strategy():
    data = request.json
    strategy_id = str(uuid.uuid4())
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO strategies (id, name, description, content, is_system)
        VALUES (?, ?, ?, ?, 0)
    ''', (strategy_id, data['name'], data.get('description', ''), data['content']))
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': strategy_id,
        'name': data['name'],
        'description': data.get('description', ''),
        'content': data['content'],
        'isSystem': False,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat(),
    })

@app.route('/api/strategies/<strategy_id>', methods=['PATCH'])
def update_strategy(strategy_id):
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE strategies
        SET name = ?, description = ?, content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (data['name'], data.get('description', ''), data['content'], strategy_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/strategies/<strategy_id>', methods=['DELETE'])
def delete_strategy(strategy_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM strategies WHERE id = ? AND is_system = 0', (strategy_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

# ==================== Chat 流式 API ====================

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])
    file_id = data.get('fileId')
    strategy_id = data.get('strategyId')
    
    # 获取配置
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT key, value FROM configs')
    configs = {row['key']: row['value'] for row in cursor.fetchall()}
    
    api_key = configs.get('siliconflow_api_key', '')
    main_model = configs.get('main_model', 'deepseek-ai/DeepSeek-V3.2')
    
    if not api_key:
        conn.close()
        return jsonify({'error': '请先配置 SiliconFlow API Key'}), 400
    
    # 获取文件内容
    file_content = ''
    if file_id:
        cursor.execute('SELECT content FROM files WHERE id = ?', (file_id,))
        row = cursor.fetchone()
        if row:
            file_content = row['content'] or ''
    
    # 获取策略内容
    system_prompt = ''
    if strategy_id:
        cursor.execute('SELECT content FROM strategies WHERE id = ?', (strategy_id,))
        row = cursor.fetchone()
        if row:
            system_prompt = row['content']
    
    conn.close()
    
    # 构建请求消息
    request_messages = []
    
    if system_prompt:
        request_messages.append({'role': 'system', 'content': system_prompt})
    
    if file_content:
        request_messages.append({
            'role': 'user',
            'content': f'以下是文件内容，请基于此回答问题：\n\n{file_content}'
        })
    
    # 添加用户消息
    for msg in messages:
        request_messages.append({'role': msg['role'], 'content': msg['content']})
    
    def generate():
        try:
            url = 'https://api.siliconflow.cn/v1/chat/completions'
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'model': main_model,
                'messages': request_messages,
                'stream': True,
                'max_tokens': 2000
            }
            
            response = requests.post(url, headers=headers, json=payload, stream=True, timeout=60)
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8')
                    if line.startswith('data: '):
                        data = line[6:]
                        if data == '[DONE]':
                            break
                        try:
                            chunk = json.loads(data)
                            if 'choices' in chunk and len(chunk['choices']) > 0:
                                delta = chunk['choices'][0].get('delta', {})
                                content = delta.get('content', '')
                                if content:
                                    yield f'data: {json.dumps({"content": content}, ensure_ascii=False)}\n\n'
                        except:
                            pass
            
        except Exception as e:
            yield f'data: {json.dumps({"error": str(e)}, ensure_ascii=False)}\n\n'
    
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

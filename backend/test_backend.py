import sys
import os

# 测试数据库初始化
print("测试数据库初始化...")
try:
    from database import init_db, get_db_connection
    init_db()
    print("✓ 数据库初始化成功")
    
    # 测试连接
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 检查策略表
    cursor.execute('SELECT COUNT(*) as cnt FROM strategies')
    count = cursor.fetchone()['cnt']
    print(f"✓ 策略表中有 {count} 条记录")
    
    # 检查配置表
    cursor.execute('SELECT COUNT(*) as cnt FROM configs')
    count = cursor.fetchone()['cnt']
    print(f"✓ 配置表中有 {count} 条记录")
    
    conn.close()
    print("✓ 数据库连接测试成功")
    
except Exception as e:
    print(f"✗ 数据库测试失败: {e}")
    sys.exit(1)

print("\n测试 Flask 应用导入...")
try:
    from app import app
    print("✓ Flask 应用导入成功")
except Exception as e:
    print(f"✗ Flask 应用导入失败: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n🎉 所有测试通过！后端可以正常启动了！")
print("\n启动命令: python app.py")

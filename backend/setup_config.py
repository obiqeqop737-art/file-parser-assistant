import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'file_parser.db')

# SiliconFlow 和 MinerU 的 API keys
SILICONFLOW_KEY = 'sk-xpagdhnlllkurqccmhcrtwdcbcepjmzsthjxcevjgtfsbkyl'
MINERU_KEY = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFM1MTIifQ.eyJqdGkiOiI5MDEwMDE5MyIsInJvbCI6IlJPTEVfUkVHSVNURVIiLCJpc3MiOiJPcGVuWExhYiIsImlhdCI6MTc3MzAxOTY4NiwiY2xpZW50SWQiOiJsa3pkeDU3bnZ5MjJqa3BxOXgydyIsInBob25lIjoiIiwib3BlbklkIjpudWxsLCJ1dWlkIjoiN2FmZGMzNDgtYTBkNS00OGUyLThiNTEtZDdmMjBjZDE2YmI2IiwiZW1haWwiOiIiLCJleHAiOjE3ODA3OTU2ODZ9.s-NbOyCl6umArABGf067b--NUsJ0p4J2_PLOAAl9MGwJNHfB6Wheh1C_DDm5yO0oiYJAKVo_JXWw5tn4qwtJ4g'

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 更新 API keys
cursor.execute('''
    INSERT OR REPLACE INTO configs (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
''', ('siliconflow_api_key', SILICONFLOW_KEY))

cursor.execute('''
    INSERT OR REPLACE INTO configs (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
''', ('mineru_api_key', MINERU_KEY))

conn.commit()
conn.close()

print("✓ API keys 配置成功！")

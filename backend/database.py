import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "astrobrief.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            source_url TEXT,
            publish_date TEXT,
            raw_text TEXT NOT NULL,
            extractive_summary TEXT NOT NULL,
            original_length INTEGER,
            summary_length INTEGER
        )
    ''')
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized.")

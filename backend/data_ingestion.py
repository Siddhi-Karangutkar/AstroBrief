import pandas as pd
import sqlite3
import os
from database import init_db, get_db_connection
from nlp_engine import summarize_extractive
import nltk

def ingest_data():
    csv_path = os.path.join(os.path.dirname(__file__), "data", "spacenews.csv")
    if not os.path.exists(csv_path):
        print(f"Data file not found at {csv_path}")
        return

    # Download required NLTK data
    nltk.download('punkt')
    nltk.download('stopwords')

    print("Initializing database...")
    init_db()

    print("Reading CSV data...")
    df = pd.read_csv(csv_path)
    
    # Check column names
    print(f"Columns found: {df.columns.tolist()}")
    
    # Assume generic columns if space_news specific aren't exact, based on typical datasets
    # typical Kaggle space news might have title, url, content, date
    text_col = 'content' if 'content' in df.columns else 'text'
    title_col = 'title' if 'title' in df.columns else 'headline'
    url_col = 'url' if 'url' in df.columns else 'source_url'
    date_col = 'date' if 'date' in df.columns else 'publish_date'

    if text_col not in df.columns:
        print("Could not find text/content column.")
        return

    # Clean data
    df = df.dropna(subset=[text_col, title_col])
    df[text_col] = df[text_col].astype(str).str.strip()
    df = df[df[text_col] != ""]
    
    batch_size = min(300, len(df))
    df_batch = df.head(batch_size)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    print(f"Processing {batch_size} rows...")
    inserted = 0
    
    for idx, row in df_batch.iterrows():
        raw_text = row[text_col]
        title = row[title_col]
        url = row[url_col] if url_col in row else ""
        pub_date = str(row[date_col]) if date_col in row else ""
        
        summary_data = summarize_extractive(raw_text, top_n=3)
        ext_summary = summary_data['summary']
        orig_len = summary_data.get('original_length', len(raw_text.split()))
        sum_len = summary_data.get('summary_length', len(ext_summary.split()))
        
        cursor.execute('''
            INSERT INTO articles (title, source_url, publish_date, raw_text, extractive_summary, original_length, summary_length)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (title, url, pub_date, raw_text, ext_summary, orig_len, sum_len))
        
        inserted += 1
        if inserted % 50 == 0:
            print(f"Inserted {inserted} records...")
            
    conn.commit()
    conn.close()
    
    db_path = os.path.join(os.path.dirname(__file__), "data", "astrobrief.db")
    db_size = os.path.getsize(db_path) / (1024 * 1024)
    print(f"Ingestion complete. Total inserted: {inserted}")
    print(f"SQLite DB size: {db_size:.2f} MB")

if __name__ == "__main__":
    ingest_data()

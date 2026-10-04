from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sqlite3
from database import get_db_connection, DB_PATH
from nlp_engine import summarize_extractive, summarize_abstractive, extract_vocabulary_stats

app = FastAPI(title="AstroBrief API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    text: str
    mode: str = "extractive"  # 'extractive' or 'abstractive'
    sentence_count: int = 3

@app.get("/api/health")
def health_check():
    db_exists = os.path.exists(DB_PATH)
    return {
        "status": "ok",
        "database_present": db_exists,
        "models": ["TF-IDF Extractive", "DistilBART Abstractive"]
    }

@app.get("/api/news")
def get_news(page: int = Query(1, ge=1), limit: int = Query(12, ge=1, le=100)):
    offset = (page - 1) * limit
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as count FROM articles")
        total_items = cursor.fetchone()["count"]
        
        cursor.execute('''
            SELECT id, title, source_url, publish_date, raw_text, extractive_summary, original_length, summary_length 
            FROM articles 
            ORDER BY id DESC 
            LIMIT ? OFFSET ?
        ''', (limit, offset))
        
        articles = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {
            "data": articles,
            "page": page,
            "limit": limit,
            "total_items": total_items,
            "total_pages": (total_items + limit - 1) // limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize")
def summarize(req: SummarizeRequest):
    if req.mode == "extractive":
        result = summarize_extractive(req.text, top_n=req.sentence_count)
    elif req.mode == "abstractive":
        result = summarize_abstractive(req.text)
    else:
        raise HTTPException(status_code=400, detail="Invalid mode. Choose 'extractive' or 'abstractive'.")
    
    return result

@app.get("/api/analytics")
def get_analytics():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as count, AVG(original_length) as avg_orig, AVG(summary_length) as avg_sum FROM articles")
        stats = cursor.fetchone()
        
        cursor.execute("SELECT raw_text FROM articles LIMIT 100") # Limit for perf
        texts = [row["raw_text"] for row in cursor.fetchall()]
        conn.close()
        
        vocab_stats = extract_vocabulary_stats(texts)
        
        avg_orig = stats["avg_orig"] or 0
        avg_sum = stats["avg_sum"] or 0
        avg_comp = 100 - (avg_sum / avg_orig * 100) if avg_orig > 0 else 0
        
        return {
            "total_articles": stats["count"],
            "average_compression_ratio": f"-{avg_comp:.0f}%",
            "vocabulary_stats": vocab_stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

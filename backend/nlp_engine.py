import os
import requests
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re
from collections import Counter
from dotenv import load_dotenv

load_dotenv()
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

HF_TOKEN = os.getenv("HF_TOKEN")
HF_API_URL = "https://router.huggingface.co/hf-inference/models/sshleifer/distilbart-cnn-12-6"

def summarize_extractive(text: str, top_n: int = 3) -> dict:
    if not text or not text.strip():
        return {"summary": "", "sentence_scores": [], "reduction_rate": "0%"}

    sentences = nltk.sent_tokenize(text)
    if len(sentences) <= top_n:
        return {
            "summary": text,
            "sentence_scores": [(i, 1.0) for i in range(len(sentences))],
            "reduction_rate": "0%"
        }

    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    try:
        tfidf_matrix = vectorizer.fit_transform(sentences)
    except ValueError:
        # e.g. empty vocabulary
        return {"summary": text, "sentence_scores": [], "reduction_rate": "0%"}

    sentence_scores = np.array(tfidf_matrix.sum(axis=1)).flatten()
    
    top_indices = sentence_scores.argsort()[-top_n:][::-1]
    top_indices.sort()
    
    summary = " ".join([sentences[i] for i in top_indices])
    
    orig_words = len(text.split())
    sum_words = len(summary.split())
    reduction = 100 - (sum_words / orig_words * 100) if orig_words > 0 else 0
    
    scores = [{"index": int(i), "score": float(sentence_scores[i])} for i in top_indices]
    
    return {
        "summary": summary,
        "sentence_scores": scores,
        "reduction_rate": f"-{reduction:.0f}% Word Count",
        "original_length": orig_words,
        "summary_length": sum_words
    }

def summarize_abstractive(text: str) -> dict:
    if not text or not text.strip():
        return {"summary": "", "reduction_rate": "0%"}
        
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": text}
    
    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        
        if isinstance(result, list) and len(result) > 0 and 'summary_text' in result[0]:
            summary = result[0]['summary_text']
        else:
            summary = text
            
        orig_words = len(text.split())
        sum_words = len(summary.split())
        reduction = 100 - (sum_words / orig_words * 100) if orig_words > 0 else 0
        
        return {
            "summary": summary,
            "reduction_rate": f"-{reduction:.0f}% Word Count",
            "original_length": orig_words,
            "summary_length": sum_words
        }
    except Exception as e:
        # Fallback if API fails or rate limited
        print(f"Abstractive API Error: {e}")
        return {
            "summary": "Error reaching Hugging Face API. Please try again or use the Extractive engine.",
            "reduction_rate": "0%",
            "original_length": len(text.split()),
            "summary_length": 0
        }

def extract_vocabulary_stats(texts: list) -> dict:
    try:
        stop_words = set(nltk.corpus.stopwords.words('english'))
    except LookupError:
        stop_words = set()

    all_words = []
    for text in texts:
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        all_words.extend([w for w in words if w not in stop_words])
        
    counter = Counter(all_words)
    top_terms = [{"text": k, "value": v} for k, v in counter.most_common(60)]
    
    return {
        "top_terms": top_terms,
        "total_tokens_removed": len([w for text in texts for w in re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())]) - len(all_words),
        "vocabulary_size": len(counter)
    }

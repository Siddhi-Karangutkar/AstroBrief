import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getNews = async (page = 1, limit = 12) => {
  const response = await axios.get(`${API_BASE}/news`, { params: { page, limit } });
  return response.data;
};

export const summarizeText = async (text, mode = 'extractive', sentenceCount = 3) => {
  const response = await axios.post(`${API_BASE}/summarize`, {
    text,
    mode,
    sentence_count: sentenceCount
  });
  return response.data;
};

export const getAnalytics = async () => {
  const response = await axios.get(`${API_BASE}/analytics`);
  return response.data;
};

# AstroBrief 🚀

AstroBrief is an end-to-end NLP (Natural Language Processing) news summarization platform and analytical dashboard. It ingests aerospace journalism, generates automated summaries, and provides an interactive dark-mode dashboard for linguistic analysis and live model testing.

![AstroBrief Dashboard](https://img.shields.io/badge/AstroBrief-v1.0-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=000)

## ✨ Key Features

- **Dual-Engine Summarization**: Compare two different NLP techniques side-by-side:
  - **Extractive Engine (Local)**: A lightweight, TF-IDF statistical model built with Scikit-Learn that extracts the most critical sentences from a text.
  - **Abstractive Engine (Cloud)**: A neural sequence-to-sequence model (DistilBART via Hugging Face) that reads and rewrites the text in its own words.
- **Cosmic News Feed**: A beautiful, glassmorphic grid displaying real space news articles with toggles for original text and quick summaries.
- **NLP Live Playground**: A real-time workbench where you can paste any text, select an engine, tweak parameters, and watch the AI condense the content.
- **Linguistic EDA Panel**: Exploratory Data Analysis (EDA) visualizations showing top aerospace vocabulary terms, token reduction metrics, and database stats.

## 🏗️ Architecture

The project is split into a robust Python backend and a dynamic React frontend:

- **Backend (`/backend`)**: Built with FastAPI, SQLite3, Scikit-Learn, and NLTK. Handles data ingestion from CSV, local text processing, and serves REST API endpoints.
- **Frontend (`/frontend`)**: Built with Vite, React, Tailwind CSS (v4), Recharts, and Lucide Icons. Features a fully responsive dark-mode space aesthetic.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- A free [Hugging Face](https://huggingface.co/) account (for the Abstractive Engine)

### 1. Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment & install dependencies**
   ```bash
   python -m venv venv
   
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   Rename the `.env.example` file to `.env` and add your Hugging Face API token:
   ```env
   HF_TOKEN=hf_your_actual_token_here
   ```

4. **Seed the Database**
   Place your dataset (`spacenews.csv`) inside `backend/data/`. Run the ingestion script to process the CSV and generate local summaries into SQLite:
   ```bash
   python data_ingestion.py
   ```

5. **Start the FastAPI Server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000`*

### 2. Frontend Setup

1. **Navigate to the frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**
   ```bash
   npm run dev
   ```
   *The dashboard will be available at `http://localhost:5173`*

---

## 🧩 API Endpoints

- `GET /api/health`: Health check and system status.
- `GET /api/news`: Fetch paginated news articles with pre-computed summaries.
- `POST /api/summarize`: Real-time inference endpoint accepting a text payload and `mode` (extractive/abstractive).
- `GET /api/analytics`: Retrieves corpus metrics and vocabulary frequency for charts.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/your-username/astrobrief/issues).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

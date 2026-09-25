# hospital-ai-discharge-assistant-

AI-powered system that generates clinician discharge summaries and patient-friendly 
discharge instructions from clinical notes using Large Language Models (LLMs).

## Progress

✅ Dataset, Preprocessing, Embeddings, Vector DB, Retriever
✅ RAG-based Generation
✅ Patient-friendly Simplification (tests, medications, diet, precautions, follow-up)
✅ Multilingual Translation (English, Telugu, Hindi) — code ready
⏳ Backend API endpoints, PostgreSQL, React frontend, PDF export



## Setup

1. Clone via GitHub Desktop
2. Install Python 3.11+, VS Code
3. `py -m pip install google-genai python-dotenv pandas datasets scikit-learn fastapi uvicorn sentence-transformers faiss-cpu rouge-score`
4. Create `.env` with your own Gemini key (free: aistudio.google.com/apikey):
   `GEMINI_API_KEY=your_key`
5. Test: `py ai-services/comprehensive_patient_summary.py`

**Note**: Gemini free tier = 20 requests/day per model. Use your own key to avoid shared quota limits.
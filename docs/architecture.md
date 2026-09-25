# Project Architecture — Hospital AI Discharge Assistant

## Overview
An AI-powered system that generates clinician discharge summaries and patient-friendly, 
multilingual discharge instructions from clinical notes using RAG (Retrieval-Augmented 
Generation) and LLMs.

## Pipeline Flow
Hospital Clinical Notes
↓
Dataset (IntelLabs/SynthClinicalNotes — 1,412 synthetic records)
↓
Data Preprocessing (cleaning, train/val/test split: 1129/141/142)
↓
Embedding Model (sentence-transformers: all-MiniLM-L6-v2)
↓
Vector Database (FAISS — 1129 indexed training cases)
↓
Retriever (top-k similar past cases, cosine/L2 similarity)
↓
Retrieved Context + New Patient Data
↓
Google Gemini API (gemini-3.6-flash) — LLM Generation
↓
AI-Generated Doctor-Style Discharge Summary (SOAP format)
↓
┌────────────┬─────────────────┐
↓ ↓ ↓
Simplified Translation (PDF Generator —
Language (Telugu/Hindi) pending)
(Patient-
Friendly)
└────────────┴─────────────────┘
↓
(React Frontend — pending)
↓
Doctor / Patient

## Component Status

| Component | Status | File |
|---|---|---|
| Dataset loading | ✅ Done | `data/load_dataset.py` |
| Data exploration | ✅ Done | `data/explore_dataset.py` |
| Train/val/test split | ✅ Done | `data/split_dataset.py` |
| Embedding + Vector DB | ✅ Done | `rag-multilingual/build_vector_db.py` |
| Retriever | ✅ Done | `rag-multilingual/retriever.py` |
| RAG-based generation | ✅ Done | `ai-services/generate_with_rag.py` |
| Comprehensive patient summary | ✅ Done | `ai-services/comprehensive_patient_summary.py` |
| Multilingual translation | ✅ Done | `rag-multilingual/translate_summary.py` |
| Evaluation (ROUGE score) | ✅ Done | `ai-services/evaluate_summaries.py` |
| Basic FastAPI backend | ✅ Done | `backend/main.py` |
| Backend API endpoints | ⏳ Pending | |
| PostgreSQL database | ⏳ Pending | |
| React frontend | ⏳ Pending | |
| PDF export | ⏳ Pending | |
| Medical NER | ⏳ Pending | |
| Doctor review workflow | ⏳ Pending | |

## Key Design Decisions

1. **RAG over direct generation**: Retrieved similar past cases are used as style/structure 
   guidance only — the prompt explicitly instructs the model not to copy patient-specific 
   facts from retrieved cases, to prevent cross-patient data leakage.

2. **No-hallucination verification**: Every generated summary was manually cross-checked 
   against the raw input data to confirm the AI only used facts present in the source, 
   never inventing details.

3. **Two-stage generation for patient-friendly summaries**: First generate a technical 
   doctor-style SOAP summary, then a second LLM call simplifies it into patient language. 
   This keeps the technical summary as the single source of truth and prevents the 
   simplification step from introducing new facts.

4. **Structured patient report sections**: What Happened / Tests / Medications / Diet / 
   Precautions / Follow-Up — chosen to match real discharge instruction needs, with an 
   explicit rule that missing information is marked "Not applicable" rather than invented.

## Known Limitations

- Gemini free tier: 20 requests/day per model — limits batch testing volume
- Dataset is synthetic (not real patient data) — good for privacy/ethics, but may not 
  capture full real-world clinical note variability
- RAG retrieval is currently based on the full `model_input` text; no filtering by 
  demographic or diagnosis similarity yet
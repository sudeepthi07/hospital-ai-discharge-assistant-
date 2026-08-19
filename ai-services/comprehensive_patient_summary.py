import os
import sys
import pandas as pd
from dotenv import load_dotenv
import google.generativeai as genai

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'rag-multilingual'))
from retriever import retrieve_similar_cases

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-3.6-flash")

df = pd.read_csv("data/processed/test.csv")
sample_input = df.iloc[0]["model_input"]

# Step 1: Doctor-style summary
similar_cases = retrieve_similar_cases(sample_input, top_k=2)
context = "\n\n---\n\n".join(similar_cases)

doctor_prompt = f"""You are a medical assistant helping doctors write hospital discharge summaries.
Reference cases (style guidance only):
{context}

Generate a structured discharge summary (SOAP format) for this patient:
{sample_input}

Discharge Summary:"""

doctor_response = model.generate_content(doctor_prompt)
doctor_summary = doctor_response.text

# Step 2: Comprehensive patient-friendly version
comprehensive_prompt = f"""You are a compassionate medical assistant creating a complete, 
easy-to-understand discharge report for a patient with no medical background.

Using ONLY the information present in the clinical summary below, create a comprehensive 
patient-friendly report with these exact sections. If information for a section is not 
available in the summary, write "Not applicable for this visit" instead of making anything up.

Use these sections, in this order:

## What Happened to You
Explain their condition/diagnosis in simple terms - what it is and why it happened.

## Tests You Had
List each test mentioned (blood tests, imaging, etc.) and explain in simple words what 
it checks for and what the result means for them.

## Your Medications
For each medicine mentioned, explain:
- What it's called
- Why you're taking it (what it does for your body, in simple terms)
- How many times a day / when to take it (if specified)
- What could happen if you skip it (only if this is medically relevant and known)

## Your Diet Plan
Simple, practical food dos and don'ts based on their condition.

## Precautions & Warning Signs
What to watch out for, and when to seek help immediately.

## Follow-Up Care
Which doctors/specialists to see, and roughly why (in simple terms).

Rules:
- No medical jargon without a plain-language explanation right after it
- Warm, reassuring tone
- Do NOT invent any fact, test, medicine, or number not present in the source summary
- Use bullet points for lists, keep sentences short

Clinical Discharge Summary (source of truth - do not add facts beyond this):
{doctor_summary}

Comprehensive Patient Report:"""

response = model.generate_content(comprehensive_prompt)

print("=" * 60)
print("COMPREHENSIVE PATIENT-FRIENDLY REPORT")
print("=" * 60)
print(response.text)
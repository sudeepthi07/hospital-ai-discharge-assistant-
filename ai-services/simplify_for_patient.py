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
similar_cases = retrieve_similar_cases(sample_input, top_k=2)
context = "\n\n---\n\n".join(similar_cases)
doctor_prompt = f"""You are a medical assistant helping doctors write hospital discharge summaries.
Here are similar past patient cases for reference (style and structure guidance only,
do not copy patient-specific facts from these):
{context}
Now, based on the following NEW patient's information, generate a clear, structured
discharge summary (SOAP format: Subjective, Objective, Assessment, Plan).
New Patient Information:
{sample_input}
Discharge Summary:"""
doctor_response = model.generate_content(doctor_prompt)
doctor_summary = doctor_response.text
print("=" * 50)
print("DOCTOR-STYLE SUMMARY (Technical)")
print("=" * 50)
print(doctor_summary)
simplify_prompt = f"""You are a caring medical assistant explaining a hospital discharge summary
to a patient who has no medical background.
Rewrite the following clinical discharge summary in simple, warm, easy-to-understand language.
Rules:
- Avoid medical jargon. If a medical term is essential, explain it in plain words right after using it.
- Keep it reassuring and supportive in tone, not alarming.
- Use short sentences and short paragraphs.
- Organize it under simple headings: "Why you were in the hospital", "What we found",
  "What this means for you", "What you need to do now".
- Do not add any medical facts that are not present in the original summary.
Clinical Discharge Summary:
{doctor_summary}
Patient-Friendly Version:"""
patient_response = model.generate_content(simplify_prompt)
print("\n" + "=" * 50)
print("PATIENT-FRIENDLY VERSION (Simplified)")
print("=" * 50)
print(patient_response.text)
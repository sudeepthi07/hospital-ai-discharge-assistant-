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
actual_summary = df.iloc[0]["ground_truth"]
similar_cases = retrieve_similar_cases(sample_input, top_k=2)
context = "\n\n---\n\n".join(similar_cases)
prompt = f"""You are a medical assistant helping doctors write hospital discharge summaries.
Here are similar past patient cases for reference (style and structure guidance only,
do not copy patient-specific facts from these):
{context}
Now, based on the following NEW patient's information, generate a clear, structured
discharge summary (SOAP format: Subjective, Objective, Assessment, Plan).
New Patient Information:
{sample_input}
Discharge Summary:"""
response = model.generate_content(prompt)
print("=" * 50)
print("RAG-ENHANCED AI-GENERATED SUMMARY")
print("=" * 50)
print(response.text)
print("\n" + "=" * 50)
print("ACTUAL GROUND TRUTH (for comparison)")
print("=" * 50)
print(actual_summary)
import os
import pandas as pd
from dotenv import load_dotenv
import google.generativeai as genai
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-3.6-flash")
df = pd.read_csv("data/processed/test.csv")
sample_input = df.iloc[0]["model_input"]
actual_summary = df.iloc[0]["ground_truth"]
prompt = f"""You are a medical assistant helping doctors write hospital discharge summaries.
Based on the following patient information, generate a clear, structured discharge summary
(SOAP format: Subjective, Objective, Assessment, Plan).
Patient Information:
{sample_input}
Discharge Summary:"""

response = model.generate_content(prompt)
print("=" * 50)
print("AI-GENERATED SUMMARY")
print("=" * 50)
print(response.text)
print("\n" + "=" * 50)
print("ACTUAL GROUND TRUTH (for comparison)")
print("=" * 50)
print(actual_summary) 
print("\n" + "=" * 50)
print("FULL MODEL INPUT (raw facts given to AI)")
print("=" * 50)
print(sample_input)
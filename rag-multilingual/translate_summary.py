import os
import sys
import time
import pandas as pd
from dotenv import load_dotenv
from google import genai

# --------------------------------------------------
# Import RAG retriever
# --------------------------------------------------

sys.path.append(
    os.path.join(os.path.dirname(__file__), '..', 'rag-multilingual')
)

from retriever import retrieve_similar_cases


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. "
        "Please check your .env file."
    )


# --------------------------------------------------
# Gemini Client - NEW SDK
# --------------------------------------------------

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-3.6-flash"


# --------------------------------------------------
# Gemini generation function with retry
# --------------------------------------------------

def generate_response(prompt, max_retries=3):

    for attempt in range(1, max_retries + 1):

        try:

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            if response.text:
                return response.text

            raise ValueError("Gemini returned an empty response.")

        except Exception as e:

            print(
                f"\nGemini request failed "
                f"(attempt {attempt}/{max_retries}):"
            )

            print(e)

            if attempt < max_retries:

                print("Retrying in 5 seconds...")
                time.sleep(5)

            else:

                print("\nGemini request failed after all retries.")
                raise


# --------------------------------------------------
# Load dataset
# --------------------------------------------------

print("\nLoading dataset...")

df = pd.read_csv("data/processed/test.csv")

sample_input = df.iloc[0]["model_input"]

print("Dataset loaded successfully.")


# --------------------------------------------------
# STEP 1
# Doctor-style discharge summary
# --------------------------------------------------

print("\n" + "=" * 60)
print("STEP 1: GENERATING DOCTOR-STYLE SUMMARY")
print("=" * 60)

print("\nRetrieving similar clinical cases...")

similar_cases = retrieve_similar_cases(
    sample_input,
    top_k=2
)

context = "\n\n---\n\n".join(similar_cases)


doctor_prompt = f"""
You are a medical assistant helping doctors write
hospital discharge summaries.

Reference cases below are provided only as style guidance.
Do not copy medical facts from them into the current patient's report.

Reference cases:
{context}

Current patient information:
{sample_input}

Generate a structured hospital discharge summary
using SOAP format:

S - Subjective
O - Objective
A - Assessment
P - Plan

Important rules:
- Use ONLY information available for the current patient.
- Do NOT invent symptoms, diagnoses, medications,
  test results, or treatment details.
- Keep the summary medically clear and concise.
- If information is unavailable, do not guess.

Discharge Summary:
"""


doctor_summary = generate_response(doctor_prompt)

print("\nDoctor-style summary generated successfully.")


# --------------------------------------------------
# STEP 2
# Patient-friendly English report
# --------------------------------------------------

print("\n" + "=" * 60)
print("STEP 2: GENERATING PATIENT-FRIENDLY ENGLISH REPORT")
print("=" * 60)


comprehensive_prompt = f"""
You are a compassionate medical assistant creating
a complete, easy-to-understand discharge report for
a patient with no medical background.

Using ONLY the information present in the clinical
summary below, create a patient-friendly discharge report.

Use these exact sections and keep them in this order:

## What Happened to You

## Tests You Had

## Your Medications

## Your Diet Plan

## Precautions & Warning Signs

## Follow-Up Care

Rules:

- Use ONLY information from the clinical summary.
- Do NOT invent any medical information.
- Do NOT assume missing information.
- If information for a section is not available,
  write exactly:
  "Not applicable for this visit."
- Avoid medical jargon.
- If a medical term is necessary, explain it immediately
  in simple language.
- Use short sentences.
- Use bullet points where appropriate.
- Keep the language simple and understandable.
- Do not add recommendations that are not present
  in the clinical summary.
- Preserve the factual meaning of the source.

Clinical Discharge Summary (source of truth):
{doctor_summary}

Comprehensive Patient Report:
"""


english_report = generate_response(comprehensive_prompt)

print("\nEnglish patient report generated successfully.")


# --------------------------------------------------
# Display English report
# --------------------------------------------------

print("\n" + "=" * 60)
print("ENGLISH VERSION")
print("=" * 60)

print(english_report)


# --------------------------------------------------
# STEP 3
# Translation function
# --------------------------------------------------

def translate_report(text, target_language):

    print("\n" + "=" * 60)
    print(f"TRANSLATING INTO {target_language.upper()}")
    print("=" * 60)

    translate_prompt = f"""
You are a professional medical translator.

Translate the following patient discharge report
into {target_language}.

Rules:

- Translate the entire report.
- Keep the same section structure.
- Translate all section headings.
- Preserve all bullet points.
- Preserve the original meaning exactly.
- Do NOT add information.
- Do NOT remove information.
- Do NOT change medical facts.
- Use simple, everyday {target_language}
  that an ordinary patient can understand.
- Avoid overly formal or literary language.
- Keep medicine names in English/Latin script.
- You may include the medicine name in
  {target_language} pronunciation in brackets.
- Do not translate medicine names in a way that
  could make them difficult to identify.
- Keep Markdown formatting.

Report to translate:

{text}

{target_language} Translation:
"""

    translated_report = generate_response(translate_prompt)

    print(
        f"\n{target_language} translation "
        f"generated successfully."
    )

    return translated_report


# --------------------------------------------------
# Telugu translation
# --------------------------------------------------

telugu_report = translate_report(
    english_report,
    "Telugu"
)


print("\n" + "=" * 60)
print("TELUGU VERSION")
print("=" * 60)

print(telugu_report)


# --------------------------------------------------
# Hindi translation
# --------------------------------------------------

hindi_report = translate_report(
    english_report,
    "Hindi"
)


print("\n" + "=" * 60)
print("HINDI VERSION")
print("=" * 60)

print(hindi_report)


# --------------------------------------------------
# Create output directory if it doesn't exist
# --------------------------------------------------

output_directory = "data/processed"

os.makedirs(
    output_directory,
    exist_ok=True
)


# --------------------------------------------------
# Save English report
# --------------------------------------------------

english_file = os.path.join(
    output_directory,
    "report_english.md"
)

with open(
    english_file,
    "w",
    encoding="utf-8"
) as f:

    f.write(english_report)


# --------------------------------------------------
# Save Telugu report
# --------------------------------------------------

telugu_file = os.path.join(
    output_directory,
    "report_telugu.md"
)

with open(
    telugu_file,
    "w",
    encoding="utf-8"
) as f:

    f.write(telugu_report)


# --------------------------------------------------
# Save Hindi report
# --------------------------------------------------

hindi_file = os.path.join(
    output_directory,
    "report_hindi.md"
)

with open(
    hindi_file,
    "w",
    encoding="utf-8"
) as f:

    f.write(hindi_report)


# --------------------------------------------------
# Final message
# --------------------------------------------------

print("\n" + "=" * 60)
print("ALL REPORTS SAVED SUCCESSFULLY")
print("=" * 60)

print("\nGenerated files:")

print(f"English : {english_file}")
print(f"Telugu  : {telugu_file}")
print(f"Hindi   : {hindi_file}")

print("\nProcess completed successfully!")
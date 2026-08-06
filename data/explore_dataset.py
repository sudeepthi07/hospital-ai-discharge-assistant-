from datasets import load_dataset
import pandas as pd

dataset = load_dataset("IntelLabs/SynthClinicalNotes")
df = dataset["test"].to_pandas()

print("=" * 50)
print("DATASET OVERVIEW")
print("=" * 50)
print("Total rows:", len(df))
print("Columns:", df.columns.tolist())

print("\n" + "=" * 50)
print("MISSING VALUES CHECK")
print("=" * 50)
print(df.isnull().sum())

print("\n" + "=" * 50)
print("TEXT LENGTH STATS (in characters)")
print("=" * 50)
df["input_length"] = df["model_input"].str.len()
df["output_length"] = df["ground_truth"].str.len()
print("\nmodel_input length:")
print(df["input_length"].describe())
print("\nground_truth length:")
print(df["output_length"].describe())

print("\n" + "=" * 50)
print("DUPLICATE ROWS CHECK")
print("=" * 50)
print("Duplicate rows:", df.duplicated().sum())
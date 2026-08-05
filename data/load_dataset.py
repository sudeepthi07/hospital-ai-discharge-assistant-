from datasets import load_dataset
import pandas as pd
dataset = load_dataset("IntelLabs/SynthClinicalNotes")
df = dataset["test"].to_pandas()
print("Total rows:", len(df))
print("\nColumns:", df.columns.tolist())
print("\nFirst example - Input:")
print(df.iloc[0]["model_input"])
print("\nFirst example - Ground truth:")
print(df.iloc[0]["ground_truth"])
df.head(50).to_csv("data/sample-100.csv", index=False)
print("\nSample saved to data/sample-100.csv")
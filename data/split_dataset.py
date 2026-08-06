from datasets import load_dataset
import pandas as pd
from sklearn.model_selection import train_test_split

dataset = load_dataset("IntelLabs/SynthClinicalNotes")
df = dataset["test"].to_pandas()

# 80% train, 10% validation, 10% test
train_df, temp_df = train_test_split(df, test_size=0.2, random_state=42)
val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42)

print("Train size:", len(train_df))
print("Validation size:", len(val_df))
print("Test size:", len(test_df))

train_df.to_csv("data/processed/train.csv", index=False)
val_df.to_csv("data/processed/val.csv", index=False)
test_df.to_csv("data/processed/test.csv", index=False)

print("\nSplit files saved to data/processed/")
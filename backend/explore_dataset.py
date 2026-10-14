from datasets import load_dataset

ds = load_dataset("IntelLabs/SynthClinicalNotes", split="test")
print("Columns:", ds.column_names)
print("Rows:", len(ds))

print("\n--- MODEL INPUT ---")
print(ds[0]["model_input"][:1500])

print("\n--- GROUND TRUTH ---")
print(ds[0]["ground_truth"][:1500])
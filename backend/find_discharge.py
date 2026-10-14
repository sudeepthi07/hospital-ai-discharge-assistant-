from datasets import load_dataset

ds = load_dataset("IntelLabs/SynthClinicalNotes", split="test")

phrases = ["discharged today", "day of discharge", "being discharged"]
matches = [
    i for i, row in enumerate(ds)
    if any(p in row["ground_truth"].lower() for p in phrases)
]

print("Discharge-day notes found:", len(matches))
print("Row numbers (first 10):", matches[:10])

if matches:
    first = matches[0]
    print("\n--- GROUND TRUTH of row", first, "---")
    print(ds[first]["ground_truth"][:2000])
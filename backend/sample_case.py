from datasets import load_dataset


def find_discharge_row(ds):
    phrases = ["discharged today", "day of discharge", "being discharged"]
    for i, row in enumerate(ds):
        if any(p in row["ground_truth"].lower() for p in phrases):
            return i
    return 0


if __name__ == "__main__":
    ds = load_dataset("IntelLabs/SynthClinicalNotes", split="test")
    idx = find_discharge_row(ds)
    case = ds[idx]["model_input"]

    with open("sample_case.txt", "w", encoding="utf-8") as f:
        f.write(case)

    print("Selected row:", idx)
    print(case[:1200])
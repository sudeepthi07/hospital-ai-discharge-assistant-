import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
index = faiss.read_index("rag-multilingual/vector_index.faiss")
case_data = pd.read_pickle("rag-multilingual/case_data.pkl")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
def retrieve_similar_cases(query_text, top_k=3):
    query_embedding = embed_model.encode([query_text])
    distances, indices = index.search(np.array(query_embedding).astype("float32"), top_k)
    similar_cases = []
    for idx in indices[0]:
        similar_cases.append(case_data.iloc[idx]["ground_truth"])
    return similar_cases
if __name__ == "__main__":
    test_df = pd.read_csv("data/processed/test.csv")
    query = test_df.iloc[0]["model_input"]
    results = retrieve_similar_cases(query, top_k=3)
    print("=" * 50)
    print("TOP 3 SIMILAR PAST CASES")
    print("=" * 50)
    for i, case in enumerate(results):
        print(f"\n--- Similar Case {i+1} ---")
        print(case[:300], "...")
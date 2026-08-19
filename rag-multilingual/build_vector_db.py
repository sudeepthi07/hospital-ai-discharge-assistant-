import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
df = pd.read_csv("data/processed/train.csv")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
print("Creating embeddings for", len(df), "cases...")
embeddings = embed_model.encode(df["model_input"].tolist(), show_progress_bar=True)
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings).astype("float32"))
faiss.write_index(index, "rag-multilingual/vector_index.faiss")
df.to_pickle("rag-multilingual/case_data.pkl")
print("Vector database built and saved!")
print("Total cases indexed:", index.ntotal)
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer

# Inicializar FastAPI
app = FastAPI(
    title="NLP Service",
    description="Microservicio para análisis de comentarios en trueques",
    version="1.0.0"
)

# Inicializar modelos (se cargan una sola vez)
sentiment_model = pipeline("sentiment-analysis")
keyword_model = KeyBERT()
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Esquema de request
class TextRequest(BaseModel):
    text: str

# Esquema de response
class NLPResponse(BaseModel):
    sentiment: dict
    keywords: list[str]
    embedding: list[float]

# Endpoint principal
@app.post("/analyze", response_model=NLPResponse)
def analyze_text(request: TextRequest):
    text = request.text

    # 1. Sentimiento
    sentiment = sentiment_model(text)[0]

    # 2. Palabras clave
    keywords = keyword_model.extract_keywords(text, top_n=5)
    keywords = [kw[0] for kw in keywords]

    # 3. Embedding
    embedding = embedding_model.encode(text).tolist()

    return {
        "sentiment": sentiment,
        "keywords": keywords,
        "embedding": embedding
    }
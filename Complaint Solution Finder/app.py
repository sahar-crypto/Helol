from fastapi import FastAPI, Query, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pinecone import Pinecone
from dotenv import load_dotenv
import os
import time
import google.generativeai as genai  
import json

# ---------------------------
# 1. Load environment variables
# ---------------------------
load_dotenv()

API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("INDEX_NAME")
NAMESPACE = os.getenv("NAMESPACE")
TOP_K = int(os.getenv("PINECONE_TOP_K"))
PINECONE_CLOUD = os.getenv("PINECONE_CLOUD")  
PINECONE_REGION = os.getenv("PINECONE_REGION")  
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")  
FIELD_MAP = os.getenv("FIELD_MAP")  
GEMINI_KEY = os.getenv("GEMINI_API_KEY")  
GEMINI_MODEL = os.getenv("GEMINI_MODEL") 
if not API_KEY:
    raise ValueError("Missing PINECONE_API_KEY in .env file")
if not INDEX_NAME:
    raise ValueError("Missing INDEX_NAME in .env file")
if not NAMESPACE:
    raise ValueError("Missing NAMESPACE in .env file")
if not TOP_K:
    raise ValueError("Missing TOP_K in .env file")
if not PINECONE_CLOUD:
    raise ValueError("Missing PINECONE_CLOUD in .env file")
if not PINECONE_REGION:
    raise ValueError("Missing PINECONE_REGION in .env file")
if not EMBEDDING_MODEL:
    raise ValueError("Missing EMBEDDING_MODEL in .env file")
if not FIELD_MAP:
    raise ValueError("Missing FIELD_MAP in .env file")
if not GEMINI_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env file")
if not GEMINI_MODEL:
    raise ValueError("Missing GEMINI_MODEL in .env file")


# ---------------------------
# 2. Initialize Pinecone + Gemini
# ---------------------------
pc = Pinecone(api_key=API_KEY)
app = FastAPI(title="Complaint Solution Finder")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=GEMINI_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

if not pc.has_index(INDEX_NAME):
    pc.create_index_for_model(
        name=INDEX_NAME,
        cloud=PINECONE_CLOUD,
        region=PINECONE_REGION,
        embed={
            "model": EMBEDDING_MODEL,
            "field_map": {"text": FIELD_MAP}
        }
    )

dense_index = pc.Index(INDEX_NAME)

# ---------------------------
# 3. Logging helper
# ---------------------------
def log_gemini_interaction(prompt: str, response: str, filename="gemini_results.json"):
    entry = {
        "prompt": prompt,
        "response": response
    }
    with open(filename, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

# ---------------------------
# 4. Endpoints
# ---------------------------

@app.get("/")
def root():
    return {"message": "Complaint Solution Finder API is running!"}


@app.post("/upsert")
def upsert_records(records: list[dict] = Body(...)):
    dense_index.upsert_records(NAMESPACE, records)
    time.sleep(2)
    return {"status": "success", "count": len(records)}


@app.get("/search")
def search_complaints(
    query: str = Query(..., description="User complaint in Arabic"),
    top_k: int = Query(None, ge=1, le=10)
):
    k = top_k or TOP_K

    results = dense_index.search(
        namespace=NAMESPACE,
        query={"top_k": k, "inputs": {"text": query}}
    )

    solutions = []
    for hit in results["result"]["hits"]:
        complaint_text = hit["fields"]["complaint_text"]
        solution_text = hit["fields"]["solution_text"]
        category = hit["fields"]["category"]
        score = round(hit["_score"], 2)

        # ---------------------------
        # Gemini similarity check (0–100)
        # ---------------------------
        prompt = f"""
        المستخدم كتب الشكوى التالية:
        "{query}"

        النظام أعاد الشكوى التالية:
        "{complaint_text}"

        قيّم هل الشكويين تتحدثان عن نفس المشكلة أو نفس الحدث 
        حتى لو في اختلاف بسيط مثل الوقت أو الصياغة.

        أعطني رقم واحد فقط من 0 إلى 100 حيث:
        - 100 = تطابق تام
        - 0 = لا علاقة
        """

        try:
            gemini_response = gemini_model.generate_content(prompt)
            relevance_text = gemini_response.text.strip()
            # استخرج رقم فقط
            similarity = int("".join([c for c in relevance_text if c.isdigit()]) or 0)
            log_gemini_interaction(prompt, relevance_text)  
        except Exception as e:
            log_gemini_interaction(prompt, f"Error: {str(e)}")
            similarity = 0

        solutions.append({
            "complaint": complaint_text,
            "solution": solution_text,
            "category": category,
            "score": score,
            "similarity": similarity
        })

    return JSONResponse(content=solutions)

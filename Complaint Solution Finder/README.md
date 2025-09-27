# Complaint Solution Finder API

A FastAPI-based server that connects **Pinecone** for semantic search and **Gemini** for natural language similarity scoring.  
It enables searching complaints in Arabic and retrieving relevant solutions.

## 🚀 Features
- Store (upsert) complaints and solutions into Pinecone.
- Search complaints in natural Arabic text.
- Validate similarity using **Google Gemini**.
- CORS-enabled (frontend friendly).
- Logging of Gemini interactions to `gemini_results.json`.



## Setup 

- Make sure python is installed in your system
- Create virtual env: 
    - python -m venv myenv
- Activate the virtual environment
    - .\myenv\Scripts\activate (for windows users)
    - source myenv/bin/activate (for linux users)
- pip install -r requirements.txt
- Install the necessary libraries
    - pip install  python-dotenv fastapi pytest uvicorn pinecone generativeai

## Run the server
- uvicorn app:app --reload


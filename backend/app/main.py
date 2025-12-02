from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "message": "FastAPI is running"}

# Further endpoints and logic will be added here

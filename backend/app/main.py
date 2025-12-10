from fastapi import FastAPI
import logging
from pythonjsonlogger import jsonlogger

# Configure logging
log_handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter('%(asctime)s %(name)s %(levelname)s %(message)s')
log_handler.setFormatter(formatter)

logger = logging.getLogger("app")
logger.addHandler(log_handler)
logger.setLevel(logging.INFO)

app = FastAPI()

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Hello World"}

@app.get("/api/v1/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "ok"}
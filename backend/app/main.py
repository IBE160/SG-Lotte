from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from pythonjsonlogger import jsonlogger

# Import routers
from app.api.v1.endpoints import users

# Configure logging
log_handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter('%(asctime)s %(name)s %(levelname)s %(message)s')
log_handler.setFormatter(formatter)

logger = logging.getLogger("app")
logger.addHandler(log_handler)
logger.setLevel(logging.INFO)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Hello World"}

@app.get("/api/v1/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "ok"}
# backend/app/core/db.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# This should dynamically get the DATABASE_URL from environment
# In a real FastAPI app, this might be configured in app/core/config.py
DATABASE_URL = os.environ.get("DATABASE_URL")

# If DATABASE_URL is not set, provide a placeholder for local development/testing
if not DATABASE_URL:
    DATABASE_URL = "postgresql://user:password@localhost:5432/dbname" # Default local postgres

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the DB session
def get_db_session():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
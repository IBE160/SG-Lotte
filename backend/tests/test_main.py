from fastapi import FastAPI
from app.main import app

def test_fastapi_app_instance():
    assert isinstance(app, FastAPI)

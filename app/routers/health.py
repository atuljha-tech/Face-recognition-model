"""
Health check endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import SessionLocal, Person, FaceEncoding
from app.models.schemas import HealthResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check(db: Session = Depends(get_db)):
    """Check if the API is running and healthy"""
    people_count = db.query(Person).count()
    encodings_count = db.query(FaceEncoding).count()
    
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        people_count=people_count,
        encodings_count=encodings_count
    )

@router.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Face Recognition API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": ["/register", "/recognize", "/users", "/health"]
    }
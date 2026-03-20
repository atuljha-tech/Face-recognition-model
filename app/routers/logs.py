"""
Recognition logs endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.database import SessionLocal
from app.models.auth import RecognitionLog

router = APIRouter(prefix="/logs", tags=["Logs"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/recognition")
async def get_recognition_logs(
    limit: int = 100,
    days: int = 7,
    db: Session = Depends(get_db)
):
    """Get recent recognition logs"""
    since_date = datetime.utcnow() - timedelta(days=days)
    
    logs = db.query(RecognitionLog).filter(
        RecognitionLog.timestamp >= since_date
    ).order_by(RecognitionLog.timestamp.desc()).limit(limit).all()
    
    return {
        "total": len(logs),
        "logs": [
            {
                "id": log.id,
                "username": log.username,
                "confidence": log.confidence,
                "recognized": log.recognized,
                "timestamp": log.timestamp.isoformat(),
                "ip_address": log.ip_address
            }
            for log in logs
        ]
    }

@router.get("/recognition/stats")
async def get_recognition_stats(days: int = 7, db: Session = Depends(get_db)):
    """Get recognition statistics"""
    since_date = datetime.utcnow() - timedelta(days=days)
    
    total = db.query(RecognitionLog).filter(
        RecognitionLog.timestamp >= since_date
    ).count()
    
    recognized = db.query(RecognitionLog).filter(
        RecognitionLog.timestamp >= since_date,
        RecognitionLog.recognized == True
    ).count()
    
    return {
        "period_days": days,
        "total_attempts": total,
        "recognized_count": recognized,
        "recognition_rate": (recognized / total * 100) if total > 0 else 0,
        "database": "SQLite"
    }
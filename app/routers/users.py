"""
User management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.database import SessionLocal, Person, FaceEncoding
from app.models.schemas import PersonResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/users", response_model=List[PersonResponse], tags=["Users"])
async def get_users(db: Session = Depends(get_db)):
    """Get list of all registered users"""
    persons = db.query(Person).all()
    
    results = []
    for person in persons:
        encoding_count = db.query(FaceEncoding).filter(FaceEncoding.person_id == person.id).count()
        results.append(PersonResponse(
            id=person.id,
            name=person.name,
            created_at=person.created_at,
            encoding_count=encoding_count
        ))
    
    return results

@router.get("/users/{user_id}", response_model=PersonResponse, tags=["Users"])
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a specific user by ID"""
    person = db.query(Person).filter(Person.id == user_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="User not found")
    
    encoding_count = db.query(FaceEncoding).filter(FaceEncoding.person_id == person.id).count()
    
    return PersonResponse(
        id=person.id,
        name=person.name,
        created_at=person.created_at,
        encoding_count=encoding_count
    )

@router.delete("/users/{user_id}", tags=["Users"])
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user and all their face encodings"""
    person = db.query(Person).filter(Person.id == user_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(person)
    db.commit()
    
    return {"success": True, "message": f"User '{person.name}' deleted successfully"}

@router.get("/stats", tags=["Users"])
async def get_stats(db: Session = Depends(get_db)):
    """Get system statistics"""
    people_count = db.query(Person).count()
    encodings_count = db.query(FaceEncoding).count()
    
    return {
        "people_count": people_count,
        "encodings_count": encodings_count,
        "database": "SQLite"
    }
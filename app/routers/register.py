"""
Person registration endpoints
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import numpy as np
import time

from app.models.database import SessionLocal, Person, FaceEncoding
from app.models.schemas import RegisterResponse
from app.services.face_service import FaceService

router = APIRouter()
face_service = FaceService()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=RegisterResponse, tags=["Registration"])
async def register_person(
    name: str = Form(..., description="Person's name"),
    images: List[UploadFile] = File(..., description="Multiple images (3-10 recommended)"),
    db: Session = Depends(get_db)
):
    """Register a new person with multiple face images"""
    start_time = time.time()
    
    # Validate name
    name = name.strip().lower()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")
    
    # Check if person already exists
    existing = db.query(Person).filter(Person.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Person '{name}' already exists")
    
    # Process images
    encodings_list = []
    
    for image_file in images[:10]:
        try:
            image_bytes = await image_file.read()
            image = face_service.decode_image(image_bytes)
            face_locations = face_service.detect_faces(image)
            
            if face_locations:
                encoding = face_service.encode_face(image, face_locations[0])
                if encoding is not None:
                    encodings_list.append(encoding)
        except Exception as e:
            print(f"Error processing {image_file.filename}: {e}")
    
    if not encodings_list:
        raise HTTPException(status_code=400, detail="No valid face encodings found")
    
    # Create person
    new_person = Person(name=name)
    db.add(new_person)
    db.flush()
    
    # Store encodings
    for encoding in encodings_list:
        face_encoding = FaceEncoding(person_id=new_person.id, encoding=encoding.tobytes())
        db.add(face_encoding)
    
    db.commit()
    
    processing_time = (time.time() - start_time) * 1000
    
    return RegisterResponse(
        success=True,
        message=f"Successfully registered {name} with {len(encodings_list)} faces",
        person_id=new_person.id,
        encodings_stored=len(encodings_list)
    )
"""
Face recognition endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import numpy as np
import time

from app.models.database import SessionLocal, FaceEncoding
from app.models.schemas import RecognizeResponse
from app.services.face_service import FaceService

router = APIRouter()
face_service = FaceService()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/recognize", response_model=RecognizeResponse, tags=["Recognition"])
async def recognize_face(
    image: UploadFile = File(..., description="Image containing face to recognize"),
    threshold: float = 0.5,
    db: Session = Depends(get_db)
):
    """Recognize a face in the uploaded image"""
    start_time = time.time()
    
    # Validate image
    if not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and process image
        image_bytes = await image.read()
        img = face_service.decode_image(image_bytes)
        
        # Detect faces
        face_locations = face_service.detect_faces(img)
        
        if not face_locations:
            return RecognizeResponse(
                success=False,
                name="Unknown",
                confidence=0.0,
                message="No face detected in image",
                processing_time_ms=(time.time() - start_time) * 1000
            )
        
        # Get encoding
        face_encoding = face_service.encode_face(img, face_locations[0])
        
        if face_encoding is None:
            return RecognizeResponse(
                success=False,
                name="Unknown",
                confidence=0.0,
                message="Could not encode face",
                processing_time_ms=(time.time() - start_time) * 1000
            )
        
        # Get all encodings from database
        encodings = db.query(FaceEncoding).all()
        
        if not encodings:
            return RecognizeResponse(
                success=True,
                name="Unknown",
                confidence=0.0,
                message="No registered faces in database",
                processing_time_ms=(time.time() - start_time) * 1000
            )
        
        # Prepare for comparison
        known_encodings = []
        known_names = []
        for enc in encodings:
            known_encodings.append(np.frombuffer(enc.encoding, dtype=np.float64))
            known_names.append(enc.person.name)
        
        # Find best match
        face_service.threshold = threshold
        name, confidence = face_service.get_best_match(face_encoding, known_encodings, known_names)
        
        processing_time = (time.time() - start_time) * 1000
        
        return RecognizeResponse(
            success=True,
            name=name,
            confidence=round(confidence, 4),
            message=f"Face recognized as {name}" if name != "Unknown" else "Face not recognized",
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
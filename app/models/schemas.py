"""
Pydantic schemas for API request/response validation
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class PersonCreate(BaseModel):
    """Schema for creating a new person"""
    name: str = Field(..., min_length=1, max_length=50, description="Person's name")

class PersonResponse(BaseModel):
    """Schema for person response"""
    id: int
    name: str
    created_at: datetime
    encoding_count: int = 0
    
    class Config:
        from_attributes = True

class RegisterResponse(BaseModel):
    """Schema for registration response"""
    success: bool
    message: str
    person_id: Optional[int] = None
    encodings_stored: int = 0

class RecognizeResponse(BaseModel):
    """Schema for recognition response"""
    success: bool
    name: str
    confidence: float
    message: str
    processing_time_ms: float

class HealthResponse(BaseModel):
    """Schema for health check"""
    status: str
    version: str
    people_count: int
    encodings_count: int
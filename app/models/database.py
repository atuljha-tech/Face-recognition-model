"""
Database models for face recognition system
"""
from sqlalchemy import create_engine, Column, Integer, String, LargeBinary, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Create data directory
os.makedirs("data", exist_ok=True)

# Database setup
DATABASE_URL = "sqlite:///data/faces.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class Person(Base):
    """Person table - stores person information"""
    __tablename__ = "persons"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with encodings
    encodings = relationship("FaceEncoding", back_populates="person", cascade="all, delete-orphan")

class FaceEncoding(Base):
    """Face encodings table - stores multiple encodings per person"""
    __tablename__ = "face_encodings"
    
    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)
    encoding = Column(LargeBinary, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    person = relationship("Person", back_populates="encodings")

# Create tables
Base.metadata.create_all(bind=engine)
print("✅ Database ready at data/faces.db")
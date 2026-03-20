"""
Authentication service - Simplified with SHA256
"""
from datetime import datetime, timedelta
from typing import Optional
import jwt
import hashlib
import secrets
from sqlalchemy.orm import Session
from app.config import settings

def get_password_hash(password: str) -> str:
    """Hash password using SHA256"""
    salt = secrets.token_hex(16)
    return hashlib.sha256(f"{password}{salt}".encode()).hexdigest() + ":" + salt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    if ":" not in hashed_password:
        return False
    stored_hash, salt = hashed_password.split(":")
    computed_hash = hashlib.sha256(f"{plain_password}{salt}".encode()).hexdigest()
    return secrets.compare_digest(stored_hash, computed_hash)

def authenticate_user(db: Session, username: str, password: str):
    """Authenticate user by username and password"""
    from app.models.auth import User
    
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.JWTError:
        return None
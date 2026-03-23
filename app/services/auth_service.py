"""
Authentication service - With hardcoded admin for demo
"""
from datetime import datetime, timedelta
from typing import Optional
import jwt
import hashlib
import secrets
from sqlalchemy.orm import Session
from app.config import settings

# HARDCODED ADMIN CREDENTIALS (for demo)
HARDCODED_ADMIN = {
    "username": "admin",
    "password": "admin123",
    "email": "admin@example.com"
}

def get_password_hash(password: str) -> str:
    """Hash password using SHA256"""
    salt = secrets.token_hex(16)
    return hashlib.sha256(f"{password}{salt}".encode()).hexdigest() + ":" + salt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    if not hashed_password or ":" not in hashed_password:
        return False
    stored_hash, salt = hashed_password.split(":")
    computed_hash = hashlib.sha256(f"{plain_password}{salt}".encode()).hexdigest()
    return secrets.compare_digest(stored_hash, computed_hash)

# DUMMY OTP: Any phone + any 6-digit OTP works for demo
def generate_otp(phone: str) -> str:
    """Generate OTP - for demo, always returns '123456'"""
    return "123456"

def verify_otp(phone: str, otp: str) -> bool:
    """Verify OTP - for demo, any 6-digit OTP works"""
    return len(otp) == 6 and otp.isdigit()

def authenticate_admin(db: Session, username: str, password: str):
    """Authenticate admin user - FIRST CHECK HARDCODED CREDENTIALS"""
    # Check hardcoded admin first
    if username == HARDCODED_ADMIN["username"] and password == HARDCODED_ADMIN["password"]:
        # Create a mock user object for hardcoded admin
        from app.models.auth import User, UserRole
        # Check if hardcoded admin exists in DB, if not, create it
        user = db.query(User).filter(User.username == HARDCODED_ADMIN["username"]).first()
        if not user:
            hashed_password = get_password_hash(HARDCODED_ADMIN["password"])
            user = User(
                username=HARDCODED_ADMIN["username"],
                email=HARDCODED_ADMIN["email"],
                hashed_password=hashed_password,
                role=UserRole.ADMIN
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    
    # Fallback to database check for other admins
    from app.models.auth import User, UserRole
    
    user = db.query(User).filter(
        User.username == username,
        User.role == UserRole.ADMIN
    ).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_or_create_user_by_phone(db: Session, phone: str):
    """Get or create a user by phone number"""
    from app.models.auth import User, UserRole
    
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        user = User(
            phone=phone,
            role=UserRole.USER,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
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
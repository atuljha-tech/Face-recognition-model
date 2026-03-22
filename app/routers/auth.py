"""
Authentication endpoints - With dummy OTP for demo
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.models.database import SessionLocal
from app.models.auth import User, UserCreate, Token, UserRole, UserLogin
from app.services.auth_service import (
    authenticate_admin, create_access_token, get_password_hash,
    generate_otp, verify_otp, get_or_create_user_by_phone, decode_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

class PhoneLoginRequest(BaseModel):
    phone: str

class PhoneVerifyRequest(BaseModel):
    phone: str
    otp: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==================== ADMIN ENDPOINTS ====================

@router.post("/admin/register", response_model=Token)
async def admin_register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new admin user"""
    user_data.role = UserRole.ADMIN
    
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        role=UserRole.ADMIN
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.username, "role": "admin", "user_id": db_user.id})
    return {"access_token": access_token, "token_type": "bearer", "role": "admin", "username": db_user.username}

@router.post("/admin/login", response_model=Token)
async def admin_login(form_data: UserLogin, db: Session = Depends(get_db)):
    """Admin login with username and password"""
    user = authenticate_admin(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    access_token = create_access_token(data={"sub": user.username, "role": "admin", "user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer", "role": "admin", "username": user.username}

# ==================== USER (PHONE) ENDPOINTS - DUMMY OTP ====================

@router.post("/user/send-otp")
async def send_otp(request: PhoneLoginRequest):
    """Send OTP - for demo, always returns 123456"""
    otp = generate_otp(request.phone)
    # For demo, just return the OTP directly
    return {"message": "OTP sent successfully", "otp": otp}

@router.post("/user/verify-otp", response_model=Token)
async def verify_otp_login(request: PhoneVerifyRequest, db: Session = Depends(get_db)):
    """Verify OTP - for demo, any 6-digit OTP works"""
    if not verify_otp(request.phone, request.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    user = get_or_create_user_by_phone(db, request.phone)
    
    access_token = create_access_token(data={"sub": user.phone, "role": "user", "user_id": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "user",
        "phone": user.phone
    }

# ==================== COMMON ENDPOINTS ====================

@router.get("/me")
async def get_current_user(token: str, db: Session = Depends(get_db)):
    """Get current user info from token"""
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("user_id")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "phone": user.phone,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at
    }
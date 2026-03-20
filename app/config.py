"""
Application configuration - Production Ready
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Face Recognition API"
    VERSION: str = "1.0.0"
    
    # CORS - Allow frontend URLs
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://your-frontend.vercel.app",  # Replace with your Vercel URL after deployment
        "https://*.vercel.app",  # Allow all Vercel preview deployments
    ]
    
    # Security - Get from environment variable
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-in-production-to-a-secure-random-string")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "20"))
    
    # Database - Use /data directory for persistence
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/data/faces.db")
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {"jpg", "jpeg", "png"}
    
    # Face Recognition
    RECOGNITION_THRESHOLD: float = 0.5

settings = Settings()
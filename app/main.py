"""
FastAPI main application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, register, recognize, users, auth, logs
from app.config import settings

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-ready Face Recognition API with authentication",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS - Allow both local and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://face-recognition-model.vercel.app",  # Your Vercel frontend
        "https://*.vercel.app",  # Allow all Vercel previews
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(register.router)
app.include_router(recognize.router)
app.include_router(users.router)
app.include_router(logs.router)

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("=" * 50)
    print(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION}")
    print("📖 Swagger docs: http://localhost:8000/docs")
    print("🔗 CORS enabled for localhost and Vercel frontend")
    print("=" * 50)

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
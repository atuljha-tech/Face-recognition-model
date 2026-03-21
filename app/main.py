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

# Configure CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Include OPTIONS
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Add custom middleware to handle OPTIONS requests
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class OptionsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            response = Response()
            response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response
        return await call_next(request)

# Add OPTIONS middleware (optional, since CORSMiddleware handles it)
# app.add_middleware(OptionsMiddleware)

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
    print("🔗 CORS enabled for: http://localhost:3000")
    print("=" * 50)

    # ADD THIS SECTION:
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
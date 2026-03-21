#!/bin/bash
set -e

echo "Starting Render build..."

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dlib-bin
echo "Installing dlib-bin..."
pip install dlib-bin==20.0.0

# Install face_recognition WITHOUT dependencies
echo "Installing face_recognition..."
pip install --no-deps face_recognition

# Install all other packages
echo "Installing other packages..."
pip install fastapi==0.104.1
pip install uvicorn==0.24.0
pip install python-multipart==0.0.6
pip install pillow==10.1.0
pip install opencv-python-headless==4.9.0.80
pip install numpy==1.26.4
pip install sqlalchemy==2.0.25
pip install python-jose[cryptography]==3.3.0
pip install PyJWT==2.8.0
pip install python-dotenv==1.0.0

# Install face recognition models
echo "Installing face recognition models..."
pip install face_recognition_models

echo "Build complete!"

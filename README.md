# 👤 Face Recognition System

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/atuljha-tech/Face-recognition-model?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue)
![FastAPI](https://img.shields.io/badge/fastapi-0.104-green)
![Next.js](https://img.shields.io/badge/next.js-15-black)

### AI-Powered Face Recognition with Dual-Panel Login

[Live Demo](https://face-recognition-model.vercel.app) · [API Docs](https://face-recognition-model-1-4dcm.onrender.com/docs)

</div>

---

## ✨ Overview

A **production-ready face recognition system** with separate portals for **Admins** and **Users**. Admins can register faces and manage users; Users can perform real-time face recognition. Built with **FastAPI** backend and **Next.js** frontend.

---

## 🎯 Features

- **🔐 Dual-Panel Login** – Admin (username/password) + User (phone/OTP)
- **📸 Real-Time Recognition** – Live webcam face detection and identification
- **👑 Admin Dashboard** – User management, statistics, face registration
- **🎨 Modern UI** – Glassmorphism design, smooth animations, responsive
- **⚡ Fast Matching** – 128-dimensional face embeddings with confidence scoring
- **📊 Recognition Logs** – Track all recognition attempts

---

## 🛠️ Tech Stack

| Backend | Frontend |
|---------|----------|
| FastAPI | Next.js 15 |
| Python 3.11 | TypeScript |
| face_recognition | TailwindCSS |
| SQLAlchemy | Framer Motion |
| SQLite | Axios |
| JWT Authentication | React Webcam |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11
- Node.js 18+

### Backend Setup

```bash
# Clone repository
git clone https://github.com/atuljha-tech/Face-recognition-model.git
cd Face-recognition-model

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')" > .env
echo "RATE_LIMIT_PER_MINUTE=10" >> .env

# Run server
uvicorn app.main:app --reload --port 8000
API available at: http://localhost:8000/docs

Frontend Setup
bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
App available at: http://localhost:3000

Create Admin User
bash
curl -X POST http://localhost:8000/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'
```

🔐 Authentication-

Admin Login
Username: admin (after registration)
Password: admin123

User Login (Demo Mode)
Any phone number works (e.g., 9876543210)

OTP: 123456 (any 6-digit OTP works)

User account auto-created on first login

🚀 Deployment-

Backend (Render)
Push code to GitHub

Create new Web Service on render.com

Set:
Build Command: ./render-build.sh
Start Command: venv/bin/uvicorn app.main:app --host 0.0.0.0 --port $PORT

Environment: PYTHON_VERSION=3.11.9, SECRET_KEY

Frontend (Vercel)
Import repository on vercel.com

Set Root Directory: frontend

Add Environment Variable: NEXT_PUBLIC_API_URL = your Render URL

📁 Project Structure
```
text
face-recognition-system/
├── app/                    # FastAPI backend
│   ├── models/            # Database models
│   ├── routers/           # API endpoints
│   ├── services/          # Business logic
│   └── middleware/        # Logging & rate limiting
├── frontend/              # Next.js frontend
│   ├── app/               # Pages (login, dashboard, etc.)
│   ├── components/        # Reusable UI components
│   └── utils/             # API client
├── requirements.txt       # Python dependencies
├── render-build.sh        # Render build script
└── .python-version        # Python version (3.11)
```
📸 How It Works
Face Detection – face_recognition locates faces in images

Face Encoding – Converts face to 128-dimensional vector

Similarity Search – Compares with stored encodings

Confidence Score – Converts distance to confidence percentage

Data Augmentation – Creates 4-16 encodings per image for better accuracy

🤝 Contributing
Contributions welcome! Please open an issue or submit a pull request.

📄 License
MIT © Atul Jha

<div align="center"> Made with ❤️ by Atul Jha </div> ```

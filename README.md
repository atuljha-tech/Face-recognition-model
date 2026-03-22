# 👤 Face Recognition System

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/atuljha-tech/Face-recognition-model?style=social)
![GitHub forks](https://img.shields.io/github/forks/atuljha-tech/Face-recognition-model?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/atuljha-tech/Face-recognition-model?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/atuljha-tech/Face-recognition-model)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

### A Production-Ready Face Recognition System with Dual-Panel Login (Admin + User)

[Demo](https://face-recognition-model.vercel.app) · [API Docs](https://face-recognition-model-1-4dcm.onrender.com/docs) · [Report Bug](https://github.com/atuljha-tech/Face-recognition-model/issues) · [Request Feature](https://github.com/atuljha-tech/Face-recognition-model/issues)

</div>

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🔧 Local Development](#-local-development)
- [🐳 Docker Deployment](#-docker-deployment)
- [🌐 API Endpoints](#-api-endpoints)
- [📱 Frontend Pages](#-frontend-pages)
- [🔐 Authentication Flow](#-authentication-flow)
- [📸 Face Recognition Pipeline](#-face-recognition-pipeline)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## ✨ Overview

**Face Recognition System** is a complete, production-ready web application that combines modern web technologies with advanced face recognition capabilities. The system features a **dual-panel login system** with separate portals for **Admins** (who can manage users and register faces) and **Regular Users** (who can only perform face recognition).

This project demonstrates a full-stack implementation of face recognition using **FastAPI** backend, **Next.js** frontend, and **face_recognition** library. It includes **JWT authentication**, **data augmentation** for better accuracy, **real-time recognition**, and a beautiful, responsive UI.

---

## 🎯 Features

### 🔐 Authentication System
- **Admin Panel**: Username/Password login with full system access
- **User Panel**: Phone number login with OTP (demo mode: any 6-digit OTP works)
- **JWT Token Authentication**: Secure API access with role-based permissions
- **Automatic Session Management**: Tokens stored in localStorage and cookies

### 📸 Face Recognition
- **Face Detection**: Real-time face detection using HOG + CNN models
- **Face Encoding**: 128-dimensional face embeddings for accurate matching
- **Multiple Encodings**: 4-16 encodings per person (with data augmentation)
- **Confidence Scoring**: Confidence-based recognition with adjustable threshold
- **Unknown Face Handling**: Automatically saves unknown faces for review

### 🎨 User Interface
- **Glassmorphism Design**: Modern, translucent UI elements with blur effects
- **Responsive Layout**: Fully responsive design for desktop, tablet, and mobile
- **Real-time Webcam**: Live camera feed with capture functionality
- **Smooth Animations**: Framer Motion powered transitions and hover effects
- **Dark/Light Mode**: Professional gradient-based color scheme

### 👑 Admin Features
- **Dashboard**: View system statistics (users, encodings, database info)
- **User Management**: Add, view, and delete registered people
- **Face Registration**: Upload multiple images for new users
- **Quick Start**: Capture selfies directly from webcam for instant registration

### 📱 User Features
- **Live Recognition**: Real-time face detection and identification
- **Simple Login**: Phone number + OTP authentication (demo mode)
- **Instant Results**: See name and confidence score immediately

### 🛡️ Security & Performance
- **CORS Protection**: Restricted cross-origin requests
- **Rate Limiting**: Prevent API abuse
- **Request Logging**: Track all API requests
- **SQLite Database**: Lightweight, file-based database
- **FAISS-like Search**: Efficient face matching (optional)

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.104.1 | Web framework for building REST APIs |
| **Python** | 3.11 | Core programming language |
| **face_recognition** | 1.3.0 | Face detection and encoding |
| **dlib-bin** | 20.0.0 | Face recognition engine (pre-compiled) |
| **SQLAlchemy** | 2.0.25 | ORM for database operations |
| **SQLite** | - | Database storage |
| **JWT** | 2.8.0 | JSON Web Token authentication |
| **OpenCV** | 4.9.0 | Image processing |
| **NumPy** | 1.26.4 | Numerical computing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.0 | React framework for production |
| **TypeScript** | 5.0 | Type-safe JavaScript |
| **TailwindCSS** | 3.4 | Utility-first CSS framework |
| **Framer Motion** | 11.0 | Animation library |
| **Axios** | 1.6 | HTTP client |
| **React Webcam** | 7.2 | Webcam integration |
| **React** | 18.2 | UI library |

### DevOps
| Tool | Purpose |
|------|---------|
| **Render** | Backend hosting (Python) |
| **Vercel** | Frontend hosting (Next.js) |
| **GitHub Actions** | CI/CD (optional) |
| **Docker** | Containerization (optional) |

---

## 📁 Project Structure
face-recognition-system/
│
├── app/ # FastAPI Backend
│ ├── main.py # Application entry point
│ ├── config.py # Configuration settings
│ ├── models/ # Database models
│ │ ├── auth.py # User models
│ │ └── database.py # SQLAlchemy setup
│ ├── routers/ # API routes
│ │ ├── auth.py # Authentication endpoints
│ │ ├── register.py # Face registration
│ │ ├── recognize.py # Face recognition
│ │ ├── users.py # User management
│ │ ├── health.py # Health checks
│ │ └── logs.py # Recognition logs
│ ├── services/ # Business logic
│ │ ├── auth_service.py # Auth logic
│ │ └── face_service.py # Face processing
│ └── middleware/ # Custom middleware
│ ├── logging.py # Request logging
│ └── rate_limit.py # Rate limiting
│
├── frontend/ # Next.js Frontend
│ ├── app/ # App router pages
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Live recognition page
│ │ ├── login/page.tsx # Login page
│ │ ├── dashboard/page.tsx # Admin dashboard
│ │ ├── register/page.tsx # Face registration
│ │ └── quick-start/page.tsx # Quick registration
│ ├── components/ # React components
│ │ ├── Navbar.tsx # Navigation bar
│ │ ├── ResultCard.tsx # Recognition results
│ │ └── StatusCard.tsx # Dashboard cards
│ ├── utils/ # Utilities
│ │ └── api.ts # API client
│ ├── types/ # TypeScript types
│ │ └── index.ts # Type definitions
│ └── public/ # Static assets
│
├── requirements.txt # Python dependencies
├── render.yaml # Render deployment config
├── render-build.sh # Render build script
├── .python-version # Python version specification
├── .env # Environment variables
└── README.md # This file

text

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11 (for backend)
- **npm** or **yarn** (package managers)
- **Git** (version control)

### Clone the Repository

```bash
git clone https://github.com/atuljha-tech/Face-recognition-model.git
cd Face-recognition-model
🔧 Local Development
Backend Setup (FastAPI)
Create virtual environment

bash
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies

bash
pip install -r requirements.txt
Set up environment variables

Create a .env file in the root directory:

env
SECRET_KEY=your-super-secret-key-change-this-in-production
RATE_LIMIT_PER_MINUTE=10
DATABASE_URL=sqlite:///data/faces.db
Generate a secure SECRET_KEY:

bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
Run the backend server

bash
uvicorn app.main:app --reload --port 8000
The API will be available at: http://localhost:8000

Swagger Documentation: http://localhost:8000/docs

ReDoc Documentation: http://localhost:8000/redoc

Frontend Setup (Next.js)
Navigate to frontend directory

bash
cd frontend
Install dependencies

bash
npm install
# or
yarn install
Set up environment variables

Create a .env.local file:

env
NEXT_PUBLIC_API_URL=http://localhost:8000
Run the development server

bash
npm run dev
# or
yarn dev
The frontend will be available at: http://localhost:3000

Testing the System
Open http://localhost:3000 in your browser

Login as Admin:

First, create an admin account via API:

bash
curl -X POST http://localhost:8000/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'
Then login with admin / admin123
```
Login as User:

Enter any phone number (e.g., 9876543210)

Click "Send OTP" → OTP 123456 appears

Enter 123456 and login

Register a Face:

Go to Quick Start page

Capture 2-3 selfies

Enter your name

Click "Register Me"

Test Recognition:

Go to Live Recognition page

Click "Capture & Recognize"

See your name with confidence score


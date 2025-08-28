@echo off
echo 🚀 Starting QMS Platform Development Environment

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.9 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo 🐍 Starting Python FastAPI Backend...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found in backend directory.
    echo 📝 Creating .env from example...
    copy .env.example .env
    echo ✏️  Please edit backend\.env with your Supabase credentials.
    pause
)

REM Start backend
echo 🚀 Starting FastAPI server on http://localhost:8000
start /b python main.py

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend
echo ⚛️  Starting Next.js Frontend...
cd ..

REM Install frontend dependencies
echo 📦 Installing Node.js dependencies...
call npm install

REM Check if .env.local file exists
if not exist ".env.local" (
    echo 📝 Creating .env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 > .env.local
)

REM Start frontend
echo 🚀 Starting Next.js server on http://localhost:3000
start /b npm run dev

echo.
echo 🎉 QMS Platform is now running!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo Press any key to stop all services
pause >nul

REM Cleanup (Note: This is basic cleanup, you might want to improve it)
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo ✅ Services stopped

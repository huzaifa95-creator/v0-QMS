#!/bin/bash

# QMS Platform Development Startup Script
echo "🚀 Starting QMS Platform Development Environment"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if required ports are available
echo "🔍 Checking if required ports are available..."
if ! check_port 8000; then
    echo "❌ Backend port 8000 is in use. Please stop the process using this port."
    exit 1
fi

if ! check_port 3000; then
    echo "❌ Frontend port 3000 is in use. Please stop the process using this port."
    exit 1
fi

# Start backend
echo "🐍 Starting Python FastAPI Backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found in backend directory. Please create one based on .env.example"
    echo "📝 Creating .env from example..."
    cp .env.example .env
    echo "✏️  Please edit backend/.env with your Supabase credentials before continuing."
    read -p "Press Enter after you've configured the .env file..."
fi

# Start backend in background
echo "🚀 Starting FastAPI server on http://localhost:8000"
python main.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running successfully!"
else
    echo "❌ Backend failed to start. Check the logs above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "⚛️  Starting Next.js Frontend..."
cd ..

# Install frontend dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Check if .env.local file exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
fi

# Start frontend
echo "🚀 Starting Next.js server on http://localhost:3000"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running successfully!"
else
    echo "❌ Frontend failed to start. Check the logs above."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 QMS Platform is now running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait

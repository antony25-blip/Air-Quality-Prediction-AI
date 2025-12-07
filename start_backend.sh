#!/bin/bash

echo "🚀 Starting Air Quality Prediction Backend"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "city_day.csv" ]; then
    echo "❌ Error: city_day.csv not found. Please run this script from the ML-PRO root directory."
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements-dev.txt

# Check if model exists, if not train it
if [ ! -f "models/air_quality_model.pkl" ]; then
    echo "🤖 Training ML model..."
    python train_model.py
else
    echo "✅ Model already exists, skipping training..."
fi

# Start the Flask server
echo "🌐 Starting Flask server..."
echo "Backend will be available at: http://localhost:5002"
echo "Press Ctrl+C to stop the server"
echo ""

python app.py

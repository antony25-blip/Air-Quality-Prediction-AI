#!/bin/bash

echo "🚀 Starting Air Quality Prediction Frontend"
echo "==========================================="

# Navigate to frontend directory
if [ -d "my-frontend" ]; then
    cd my-frontend
else
    echo "❌ Error: my-frontend directory not found. Please run this script from the ML-PRO root directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the dev server
echo "🌐 Starting Vite development server..."
npm run dev

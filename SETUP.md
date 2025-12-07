# Air Quality Prediction System - Setup Guide

This guide will help you set up and run the complete Air Quality Prediction system with both frontend and backend components.

## 🏗️ System Architecture

```
ML-PRO/
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── train_model.py      # ML model training script
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   └── models/             # Trained ML models (created after training)
├── my-frontend/            # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── pages/          # Page components
│   └── package.json        # Node.js dependencies
├── city_day.csv           # Air quality dataset
└── start_backend.sh       # Backend startup script
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

1. **Start the Backend**:
   ```bash
   ./start_backend.sh
   ```
   This script will:
   - Create a virtual environment
   - Install dependencies
   - Train the ML model (if not already trained)
   - Start the Flask server

2. **Start the Frontend** (in a new terminal):
   ```bash
   cd my-frontend
   npm install
   npm run dev
   ```
   **OR** simply run:
   ```bash
   ./start_frontend.sh
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5002

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the ML model**:
   ```bash
   python train_model.py
   ```

5. **Start the Flask server**:
   ```bash
   python app.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd my-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🐳 Docker Setup (Alternative)

### Backend with Docker

1. **Build and run the backend**:
   ```bash
   cd backend
   docker-compose up --build
   ```

### Frontend with Docker

1. **Create a Dockerfile for frontend** (if needed):
   ```bash
   cd my-frontend
   # Add Dockerfile for frontend if desired
   ```

## 📊 Features

### Backend Features
- **REST API** with Flask
- **ML Model Integration** using scikit-learn
- **CORS Support** for frontend integration
- **Health Monitoring** endpoints
- **Model Persistence** with joblib
- **Docker Support** for containerization

### Frontend Features
- **React-based UI** with modern design
- **Real-time Predictions** via API calls
- **Interactive Forms** for data input
- **Detailed Results** with confidence scores
- **Error Handling** and loading states
- **Responsive Design** with Tailwind CSS

### API Endpoints

- `GET /health` - Health check
- `POST /predict` - Make air quality prediction
- `GET /model-info` - Get model information
- `GET /features` - Get required features list

## 🔧 Configuration

### Backend Configuration

The backend can be configured using environment variables:

```bash
export FLASK_ENV=production  # or development
export PORT=5002
```

### Frontend Configuration

Update the API base URL in `my-frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5002';  // Change if backend runs on different port
```

## 📈 Model Information

The system uses a **Random Forest Classifier** trained on air quality data with the following features:

- PM2.5, PM10 concentrations
- NO, NO2, NOx levels
- NH3, CO, SO2, O3 levels
- Benzene, Toluene concentrations

**Target Categories**:
- Good
- Moderate
- Unhealthy for Sensitive Groups
- Unhealthy
- Very Unhealthy
- Hazardous

## 🧪 Testing the System

### Test Backend API

1. **Health Check**:
   ```bash
   curl http://localhost:5002/health
   ```

2. **Make Prediction**:
   ```bash
   curl -X POST http://localhost:5002/predict \
     -H "Content-Type: application/json" \
     -d '{
       "pm25": 25.5,
       "pm10": 45.2,
       "no": 12.3,
       "no2": 18.7,
       "nox": 31.0,
       "nh3": 5.2,
       "co": 1.8,
       "so2": 15.3,
       "o3": 35.6,
       "benzene": 2.1,
       "toluene": 3.4
     }'
   ```

### Test Frontend

1. Open http://localhost:5173 in your browser
2. Fill in the air quality parameters
3. Click "Predict" to see the results

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check if port 5002 is available
   - Ensure all dependencies are installed
   - Check if the model was trained successfully

2. **Frontend can't connect to backend**:
   - Verify backend is running on port 5002
   - Check CORS settings
   - Update API_BASE_URL if needed

3. **Model training fails**:
   - Ensure city_day.csv exists in the root directory
   - Check Python dependencies
   - Verify sufficient disk space for model files

4. **Docker issues**:
   - Ensure Docker is installed and running
   - Check if ports 5002 and 5173 are available
   - Try rebuilding containers: `docker-compose up --build`

### Logs and Debugging

- **Backend logs**: Check terminal output when running `python app.py`
- **Frontend logs**: Check browser console and terminal output
- **Model training logs**: Check output when running `python train_model.py`

## 📁 File Structure Details

```
backend/
├── app.py                  # Main Flask application with API endpoints
├── train_model.py          # ML model training and evaluation
├── requirements.txt        # Python package dependencies
├── Dockerfile             # Docker configuration for backend
├── docker-compose.yml     # Docker Compose configuration
├── README.md              # Backend documentation
├── models/                # Generated after training
│   ├── air_quality_model.pkl
│   ├── label_encoder.pkl
│   └── feature_columns.pkl
└── plots/                 # Generated visualizations
    ├── feature_importance.png
    └── confusion_matrix.png

my-frontend/
├── src/
│   ├── components/
│   │   ├── InputForm.jsx      # Input form component
│   │   ├── PredictionResult.jsx # Results display component
│   │   ├── Loader.jsx         # Loading component
│   │   └── ErrorAlert.jsx     # Error display component
│   ├── services/
│   │   └── api.js             # API service layer
│   ├── pages/
│   │   └── Home.jsx           # Main page component
│   └── App.jsx                # Root component
├── package.json              # Node.js dependencies
└── vite.config.js            # Vite configuration
```

## 🎯 Next Steps

1. **Deploy to Production**: Use cloud services like AWS, Google Cloud, or Heroku
2. **Add Authentication**: Implement user authentication if needed
3. **Database Integration**: Add database for storing prediction history
4. **Monitoring**: Add logging and monitoring tools
5. **API Documentation**: Use Swagger/OpenAPI for API documentation
6. **Testing**: Add unit and integration tests

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all dependencies are correctly installed
4. Verify the system requirements are met

## 🏆 Success!

Once everything is running, you should have:
- A working Flask backend API on port 5002
- A React frontend on port 5173
- A trained ML model for air quality prediction
- A complete end-to-end prediction system

Enjoy your Air Quality Prediction System! 🌟

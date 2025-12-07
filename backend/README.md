# Air Quality Prediction Backend

A Flask-based REST API for air quality prediction using machine learning.

## Features

- **ML Model Integration**: Uses Random Forest classifier for air quality prediction
- **REST API**: Clean REST endpoints for predictions and model information
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration
- **Health Monitoring**: Health check endpoints for monitoring
- **Docker Support**: Containerized deployment with Docker and Docker Compose
- **Model Persistence**: Saves trained models and artifacts for production use

## API Endpoints

### Health Check
- `GET /health` - Check API health and model status

### Predictions
- `POST /predict` - Make air quality predictions
- `GET /model-info` - Get model information
- `GET /features` - Get list of required features

## Required Features for Prediction

The API expects the following features in the request body:

- `pm25` - PM2.5 concentration (μg/m³)
- `pm10` - PM10 concentration (μg/m³)
- `no` - Nitric Oxide concentration (μg/m³)
- `no2` - Nitrogen Dioxide concentration (μg/m³)
- `nox` - Nitrogen Oxides concentration (μg/m³)
- `nh3` - Ammonia concentration (μg/m³)
- `co` - Carbon Monoxide concentration (mg/m³)
- `so2` - Sulfur Dioxide concentration (μg/m³)
- `o3` - Ozone concentration (μg/m³)
- `benzene` - Benzene concentration (μg/m³)
- `toluene` - Toluene concentration (μg/m³)

## Setup and Installation

### Prerequisites
- Python 3.9+
- pip
- Docker (optional)

### Local Development

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Train the model**:
   ```bash
   python train_model.py
   ```

3. **Run the Flask app**:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

### Docker Deployment

1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

2. **Or build and run manually**:
   ```bash
   docker build -t air-quality-api .
   docker run -p 5000:5000 air-quality-api
   ```

## Usage Examples

### Health Check
```bash
curl http://localhost:5000/health
```

### Make Prediction
```bash
curl -X POST http://localhost:5000/predict \
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

### Get Model Information
```bash
curl http://localhost:5000/model-info
```

### Get Required Features
```bash
curl http://localhost:5000/features
```

## Response Format

### Prediction Response
```json
{
  "prediction": "Good",
  "confidence": 85.6,
  "probabilities": {
    "Good": 85.6,
    "Moderate": 12.3,
    "Unhealthy for Sensitive Groups": 2.1
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "input_data": {
    "pm25": 25.5,
    "pm10": 45.2,
    ...
  }
}
```

## Model Training

The model training script (`train_model.py`) performs the following steps:

1. Loads and preprocesses the air quality dataset
2. Handles missing values and data cleaning
3. Encodes categorical target variables
4. Splits data into training and testing sets
5. Trains a Random Forest classifier
6. Evaluates model performance
7. Saves the trained model and artifacts
8. Generates visualization plots

## File Structure

```
backend/
├── app.py                 # Main Flask application
├── train_model.py         # Model training script
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── README.md             # This file
├── models/               # Saved model artifacts
│   ├── air_quality_model.pkl
│   ├── label_encoder.pkl
│   └── feature_columns.pkl
└── plots/                # Generated visualizations
    ├── feature_importance.png
    └── confusion_matrix.png
```

## Environment Variables

- `FLASK_ENV` - Flask environment (development/production)
- `PORT` - Port number (default: 5000)

## Monitoring and Logging

The application includes comprehensive logging for:
- Model loading status
- Prediction requests and responses
- Error handling and debugging
- Health check monitoring

## License

This project is part of the ML-PRO air quality prediction system.

from flask import Flask, request, jsonify
from flask_cors import CORS
# import pandas as pd  # Removed for Vercel optimization
import joblib
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables for model and encoder
model = None
label_encoder = None
feature_columns = None

def load_model():
    """Load the trained model and label encoder"""
    global model, label_encoder, feature_columns
    
    try:
        # Get absolute path to the directory containing this script
        base_dir = os.path.dirname(os.path.abspath(__file__))
        models_dir = os.path.join(base_dir, 'models')

        # Load the model
        model = joblib.load(os.path.join(models_dir, 'air_quality_model.pkl'))
        label_encoder = joblib.load(os.path.join(models_dir, 'label_encoder.pkl'))
        feature_columns = joblib.load(os.path.join(models_dir, 'feature_columns.pkl'))
        
        logger.info("Model loaded successfully")
        return True
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False

def predict_air_quality(data):
    """Make prediction using the loaded model"""
    try:
        # Prepare input vector directly without pandas
        input_vector = []
        
        # Ensure all required features are present and in the correct order
        # feature_columns is a numpy array from training
        for col in feature_columns:
            # col is the feature name (e.g., 'PM2.5')
            # data has mapped keys (e.g., 'PM2.5')
            val = data.get(col, 0.0)
            input_vector.append(val)
        
        # Reshape for scikit-learn (1 sample, n features)
        # We can use a 2D list or rely on numpy if available, but a list of lists works for sklearn too usually.
        # However, since we have numpy installed (it's a dependency of scikit-learn), let's use it for safety/consistency if needed.
        # But to be safe and simple:
        input_array = [input_vector] 
        # (sklearn accepts list of lists)
        
        # Make prediction
        pred_encoded = model.predict(input_array)[0]
        pred_category = label_encoder.inverse_transform([pred_encoded])[0]
        
        # Get prediction probabilities
        probabilities = model.predict_proba(input_array)[0]
        confidence = max(probabilities)
        
        return {
            'prediction': pred_category,
            'confidence': round(confidence * 100, 2),
            'probabilities': {
                category: round(prob * 100, 2) 
                for category, prob in zip(label_encoder.classes_, probabilities)
            }
        }
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        raise e

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': model is not None
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please check server logs.'
            }), 500
        
        # Get input data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No input data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['pm25', 'pm10', 'no', 'no2', 'nox', 'nh3', 'co', 'so2', 'o3', 'benzene', 'toluene']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Convert string values to float
        # Map input keys to model feature names
        feature_mapping = {
            'pm25': 'PM2.5',
            'pm10': 'PM10',
            'no': 'NO',
            'no2': 'NO2',
            'nox': 'NOx',
            'nh3': 'NH3',
            'co': 'CO',
            'so2': 'SO2',
            'o3': 'O3',
            'benzene': 'Benzene',
            'toluene': 'Toluene'
        }

        try:
            processed_data = {}
            for k, v in data.items():
                if k in required_fields:
                    # Map the key to the model's expected feature name
                    model_key = feature_mapping.get(k, k)
                    processed_data[model_key] = float(v)
        except ValueError as e:
            return jsonify({
                'error': f'Invalid input format: {str(e)}'
            }), 400
        
        # Make prediction
        result = predict_air_quality(processed_data)
        
        # Add additional information
        result['timestamp'] = datetime.now().isoformat()
        result['input_data'] = processed_data
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return jsonify({
            'error': 'Model not loaded'
        }), 500
    
    return jsonify({
        'model_type': type(model).__name__,
        'feature_columns': feature_columns.tolist() if feature_columns is not None else [],
        'classes': label_encoder.classes_.tolist() if label_encoder is not None else [],
        'n_features': len(feature_columns) if feature_columns is not None else 0
    })

@app.route('/api/features', methods=['GET'])
def get_features():
    """Get list of required features for prediction"""
    return jsonify({
        'features': [
            {'name': 'pm25', 'description': 'PM2.5 concentration (μg/m³)'},
            {'name': 'pm10', 'description': 'PM10 concentration (μg/m³)'},
            {'name': 'no', 'description': 'Nitric Oxide concentration (μg/m³)'},
            {'name': 'no2', 'description': 'Nitrogen Dioxide concentration (μg/m³)'},
            {'name': 'nox', 'description': 'Nitrogen Oxides concentration (μg/m³)'},
            {'name': 'nh3', 'description': 'Ammonia concentration (μg/m³)'},
            {'name': 'co', 'description': 'Carbon Monoxide concentration (mg/m³)'},
            {'name': 'so2', 'description': 'Sulfur Dioxide concentration (μg/m³)'},
            {'name': 'o3', 'description': 'Ozone concentration (μg/m³)'},
            {'name': 'benzene', 'description': 'Benzene concentration (μg/m³)'},
            {'name': 'toluene', 'description': 'Toluene concentration (μg/m³)'}
        ]
    })

# Load model intentionally at module level so it runs on Vercel
load_model()

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    logger.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5002)

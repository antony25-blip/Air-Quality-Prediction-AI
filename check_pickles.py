import joblib
import pandas as pd
import sys

try:
    print("Checking feature_columns.pkl...")
    cols = joblib.load('backend/models/feature_columns.pkl')
    print(f"Type: {type(cols)}")
    print(f"Content: {cols}")
    
    print("\nChecking label_encoder.pkl...")
    le = joblib.load('backend/models/label_encoder.pkl')
    print(f"Type: {type(le)}")
    print(f"Classes: {le.classes_}")
    
    print("\nChecking air_quality_model.pkl...")
    model = joblib.load('backend/models/air_quality_model.pkl')
    print(f"Type: {type(model)}")

except Exception as e:
    print(f"Error: {e}")

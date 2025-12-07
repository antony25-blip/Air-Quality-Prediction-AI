import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

def load_and_preprocess_data(csv_path):
    """Load and preprocess the air quality dataset"""
    print("Loading dataset...")
    df = pd.read_csv(csv_path)
    
    print(f"Original dataset shape: {df.shape}")
    
    # Drop Xylene column as it's not used in the original model
    if 'Xylene' in df.columns:
        df = df.drop(columns=['Xylene'])
    
    # Select numeric columns for features
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    
    # Fill missing values with median
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Drop rows with missing AQI_Bucket
    df = df.dropna(subset=['AQI_Bucket'])
    
    print(f"Dataset shape after preprocessing: {df.shape}")
    print(f"Target distribution:\n{df['AQI_Bucket'].value_counts()}")
    
    return df, numeric_cols

def train_model(df, numeric_cols):
    """Train the Random Forest model"""
    print("Training model...")
    
    # Encode AQI_Bucket
    le = LabelEncoder()
    df['AQI_Bucket_Encoded'] = le.fit_transform(df['AQI_Bucket'])
    
    # Prepare features and target
    X = df[numeric_cols].drop(columns=['AQI'])
    y = df['AQI_Bucket_Encoded']
    
    print(f"Feature columns: {list(X.columns)}")
    print(f"Number of features: {X.shape[1]}")
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train Random Forest Classifier
    rf = RandomForestClassifier(
        n_estimators=100, 
        random_state=42,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2
    )
    
    rf.fit(X_train, y_train)
    
    # Make predictions
    y_pred = rf.predict(X_test)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.4f}")
    
    # Print classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))
    
    return rf, le, X.columns, X_test, y_test, y_pred

def save_model_and_artifacts(model, label_encoder, feature_columns, X_test, y_test, y_pred):
    """Save the trained model and artifacts"""
    print("Saving model and artifacts...")
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Save model and encoder
    joblib.dump(model, 'models/air_quality_model.pkl')
    joblib.dump(label_encoder, 'models/label_encoder.pkl')
    joblib.dump(feature_columns, 'models/feature_columns.pkl')
    
    print("Model saved successfully!")
    
    # Generate and save visualizations
    generate_visualizations(model, label_encoder, X_test, y_test, y_pred)

def generate_visualizations(model, label_encoder, X_test, y_test, y_pred):
    """Generate and save model evaluation visualizations"""
    print("Generating visualizations...")
    
    # Create plots directory
    os.makedirs('plots', exist_ok=True)
    
    # Feature importance plot
    plt.figure(figsize=(10, 8))
    feature_importance = pd.DataFrame({
        'feature': model.feature_names_in_,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=True)
    
    plt.barh(feature_importance['feature'], feature_importance['importance'])
    plt.title('Feature Importance')
    plt.xlabel('Importance')
    plt.tight_layout()
    plt.savefig('plots/feature_importance.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # Confusion matrix
    plt.figure(figsize=(10, 8))
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=label_encoder.classes_, 
                yticklabels=label_encoder.classes_)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig('plots/confusion_matrix.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Visualizations saved to plots/ directory")

def main():
    """Main training pipeline"""
    print("Starting Air Quality Model Training Pipeline")
    print("=" * 50)
    
    # Load and preprocess data
    df, numeric_cols = load_and_preprocess_data('../city_day.csv')
    
    # Train model
    model, label_encoder, feature_columns, X_test, y_test, y_pred = train_model(df, numeric_cols)
    
    # Save model and artifacts
    save_model_and_artifacts(model, label_encoder, feature_columns, X_test, y_test, y_pred)
    
    print("=" * 50)
    print("Training pipeline completed successfully!")
    print(f"Model saved to: models/air_quality_model.pkl")
    print(f"Label encoder saved to: models/label_encoder.pkl")
    print(f"Feature columns saved to: models/feature_columns.pkl")

if __name__ == "__main__":
    main()

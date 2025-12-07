import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv("city_day.csv")
df = df.drop(columns=["Xylene"])
numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
df = df.dropna(subset=["AQI_Bucket"])

#  Encode AQI_Bucket
le = LabelEncoder()
df["AQI_Bucket_Encoded"] = le.fit_transform(df["AQI_Bucket"])
X = df[numeric_cols].drop(columns=["AQI"]) 
y = df["AQI_Bucket_Encoded"]
#  Train-test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
#  Train Random Forest Classifier
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

def predict_aqi():
    print("Welcome to the Air Quality Checker!")
    user_input = {}
    for feature in X.columns:
        while True:
            try:
                value = float(input(f"Enter value for {feature}: "))
                user_input[feature] = value
                break
            except ValueError:
                print("Invalid input. Please enter a number.")
    # Convert dict to DataFrame
    input_df = pd.DataFrame([user_input])
    # Predict encoded label
    pred_encoded = rf.predict(input_df)[0]
    # Convert back to original category
    pred_category = le.inverse_transform([pred_encoded])[0]
    print(f"\nPredicted AQI Category: {pred_category}")

if __name__ == "__main__":
    predict_aqi()
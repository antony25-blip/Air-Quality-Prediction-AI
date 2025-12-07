import pandas as pd

# Load dataset
df = pd.read_csv("city_day.csv")

# Basic info
print("Dataset shape:", df.shape)
print("\nColumns and data types:")
print(df.dtypes)

# Missing values
print("\nMissing values per column:")
print(df.isnull().sum())

# Summary statistics
print("\nSummary statistics:")
print(df.describe())

# Target variable distribution
print("\nAQI_Bucket value counts:")
print(df['AQI_Bucket'].value_counts())

import os

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/model_performance_db")
    FASTAPI_URL = os.getenv("FASTAPI_URL", "http://fastapi-app:8000/predict")
    FEATURES_COLUMNS = [
        'fixed acidity', 'volatile acidity', 'citric acid', 'residual sugar', 'chlorides',
        'free sulfur dioxide', 'total sulfur dioxide', 'density', 'pH', 'sulphates', 'alcohol'
    ]


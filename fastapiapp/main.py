from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import joblib
import numpy as np
import os
import xgboost as xgb
from functools import lru_cache

app = FastAPI()

# Define the directory where models and scalers are stored
MODEL_DIR = "models"
SCALER_DIR = "scalers"

class Features(BaseModel):
    features: list[float]
    model_version: str
    model_type: str

@lru_cache(maxsize=2)
def get_model_path(model_version: str, model_type: str) -> str:
    """
    Constructs the full path for the model based on its type and version.
    """
    model_filename = f"{model_type}_{model_version}.json"
    return os.path.join(MODEL_DIR, model_filename)

@lru_cache(maxsize=2)
def get_scaler_path(model_version: str, model_type: str) -> str:
    """
    Constructs the full path for the scaler based on its type and version.
    """
    scaler_filename = f"{model_type}_{model_version}_scaler.pkl"
    return os.path.join(SCALER_DIR, scaler_filename)

@lru_cache(maxsize=2)
def load_model(model_version: str, model_type: str):
    """
    Load a model based on model_version and model_type.
    """
    model_path = get_model_path(model_version, model_type)
    
    # Check if the model file exists
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model '{model_type}' version '{model_version}' not found.")
    
    model = xgb.Booster()
    model.load_model(model_path)
    
    return model

@lru_cache(maxsize=2)
def load_scaler(model_version: str, model_type: str):
    """
    Load the scaler based on model_version and model_type.
    """
    scaler_path = get_scaler_path(model_version, model_type)
    
    # Check if the scaler file exists
    if not os.path.exists(scaler_path):
        raise FileNotFoundError(f"Scaler for model '{model_type}' version '{model_version}' not found.")
    
    with open(scaler_path, "rb") as f:
        scaler = joblib.load(f)
    
    return scaler

def make_prediction(model, features: list[float], scaler) -> int:
    """
    Applies scaling to features, reshapes them, and uses the model to make a prediction.
    """
    # Scale the features
    features_array = np.array(features).reshape(1, -1)
    scaled_features = scaler.transform(features_array)
    
    # Convert to DMatrix for XGBoost
    dmatrix = xgb.DMatrix(scaled_features)
    prediction = model.predict(dmatrix)
    
    return int(prediction[0])

@app.post("/predict")
async def predict(data: Features):
    try:
        # Load the model and scaler
        model = load_model(data.model_version, data.model_type)
        scaler = load_scaler(data.model_version, data.model_type)
        
        # Make a prediction
        prediction = make_prediction(model, data.features, scaler)
        
        return {"prediction": prediction}

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred during prediction.")

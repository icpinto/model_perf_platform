from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import joblib
import numpy as np
import os
import xgboost as xgb
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor
from threading import Lock

app = FastAPI()

MODEL_DIR = "models" 

# Use a global cache for models
model_cache = {}
model_lock = Lock()

class Features(BaseModel):
    features: list[float]
    model_version: str
    model_type: str

def get_model_path(model_version: str, model_type: str) -> str:
    model_filename = f"{model_type}_{model_version}.json"
    return os.path.join(MODEL_DIR, model_filename)

def load_model(model_version: str, model_type: str):
    """
    Load a model based on model_version and model_type. Cache it in memory to improve performance.
    """
    model_key = f"{model_type}_{model_version}"

    # Check if model is already cached
    if model_key in model_cache:
        return model_cache[model_key]

    model_path = get_model_path(model_version, model_type)

    # Check if the model file exists
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model '{model_type}' version '{model_version}' not found.")
    
    model = xgb.Booster()
    model.load_model(model_path)
    
    # Cache model in memory to avoid loading it repeatedly
    with model_lock:  # Ensures thread safety for model caching
        model_cache[model_key] = model
    
    return model

def make_prediction(model, features: list[float]) -> int:
    """
    Use the model to make a prediction.
    """
    features_array = np.array(features).reshape(1, -1)
    prediction = model.predict(features_array)
    return int(prediction[0])

@app.post("/predict")
async def predict(data: Features, background_tasks: BackgroundTasks):
    try:
        # Use background tasks for heavy operations (if necessary)
        model = load_model(data.model_version, data.model_type)
        
        features = np.array(data.features).reshape(1, -1)  
        prediction = make_prediction(model, features)
        
        return  {"prediction": int(prediction[0])}

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred during prediction.")


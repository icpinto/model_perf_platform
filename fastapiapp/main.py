from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os
import logging
import xgboost as xgb

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the directory where models are storeddd
MODEL_DIR = "models"

class Features(BaseModel):
    features: list[float]
    model_version: str
    model_type: str

def get_model_path(model_version: str, model_type: str) -> str:
    """
    Constructs the full path for the model based on its type and version.
    """
    model_filename = f"{model_type}_{model_version}.pkl"
    return os.path.join(MODEL_DIR, model_filename)

def load_model(model_version: str, model_type: str):
    """
    Load a model based on model_version and model_type.
    """
    # Construct the filename using model_type and model_version
    model_filename = f"{model_type}_{model_version}.json" 
    model_path = os.path.join(MODEL_DIR, model_filename)
    
    # Check if the model file exists
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model '{model_type}' version '{model_version}' not found.")
    
    model = xgb.Booster()
    model.load_model(model_path)
    
    return model

def make_prediction(model, features: list[float]) -> int:
    """
    Reshapes and converts features, then uses the model to make a prediction.
    """
    features_array = np.array(features).reshape(1, -1)
    prediction = model.predict(features_array)
    return int(prediction[0])

@app.post("/predict")
async def predict(data: Features):
    try:
        model = load_model(data.model_version, data.model_type)
        
        features = xgb.DMatrix(np.array(data.features).reshape(1, -1))
        
        prediction = model.predict(features)
        
        return {"prediction": int(prediction[0])}

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred during prediction.")
##dedfdffd


from flask import Blueprint, request, jsonify
import pandas as pd
import requests
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from datetime import datetime
import config
from database import execute_query, insert_model_run
from sqlalchemy import text

predict_blueprint = Blueprint('predict', __name__)
models_blueprint = Blueprint('models', __name__)
history_blueprint = Blueprint('history', __name__)

# Prediction route
@predict_blueprint.route('/predict', methods=['POST'])
def predict():
    try:
        file, model_type, model_version = validate_request_data(request)
        
        df = pd.read_csv(file)
        validate_csv_columns(df, config.Config.FEATURES_COLUMNS + ['quality'])
        
        features, actual_labels = prepare_features_labels(df, config.Config.FEATURES_COLUMNS)
        predictions = fetch_predictions(features, model_type, model_version)
        
        metrics = calculate_metrics(actual_labels, predictions)
        save_metrics_to_db(metrics, model_version, dataset_version=1.0)
        
        return jsonify({"predictions": predictions, "metrics": metrics})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Helper functions for prediction route
def validate_request_data(request):
    if 'file' not in request.files:
        raise ValueError("No file provided")
    if 'model_type' not in request.form or 'model_version' not in request.form:
        raise ValueError("Model type and version must be specified")
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        raise ValueError("Only CSV files are allowed")
    return file, request.form['model_type'], request.form['model_version']

def validate_csv_columns(df, required_columns):
    for column in required_columns:
        if column not in df.columns:
            raise ValueError(f"CSV file must contain '{column}' column")

def prepare_features_labels(df, feature_columns):
    return df[feature_columns].values.tolist(), df['quality'].tolist()

def fetch_predictions(features, model_type, model_version):
    predictions = []
    for feature in features:
        payload = {'features': feature, 'model_type': model_type, 'model_version': model_version}
        response = requests.post(config.Config.FASTAPI_URL, json=payload)
        if response.status_code != 200:
            raise ConnectionError("Failed to get prediction from FastAPI service")
        predictions.append(response.json()['prediction'])
    return predictions

def calculate_metrics(actual_labels, predictions):
    return {
        "accuracy": accuracy_score(actual_labels, predictions),
        "precision": precision_score(actual_labels, predictions, average='weighted', zero_division=1),
        "recall": recall_score(actual_labels, predictions, average='weighted', zero_division=1),
        "f1_score": f1_score(actual_labels, predictions, average='weighted', zero_division=1)
    }

def save_metrics_to_db(metrics, model_version, dataset_version):
    insert_model_run({
        "model_version": model_version,
        "dataset_version": dataset_version,
        "timestamp": datetime.now(),
        **metrics
    })
#test github workflow
#test github workflow
#test github workflow
#test github workflow

# Models route
@models_blueprint.route('/models', methods=['GET'])
def get_models():
    try:
        query = """
            SELECT model_version, model_type, hyperparameters, description, created_at FROM models
            ORDER BY created_at DESC;
        """
        models = [
            dict(row) for row in execute_query(query).mappings()
        ]
        return jsonify(models), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Performance history route
@history_blueprint.route('/performance_history', methods=['GET'])
def get_performance_history():
    """
    Retrieve performance metrics history, combined with model and dataset descriptions.
    """
    try:
        query = """
                    SELECT mr.run_id, mr.model_version, mr.dataset_version, mr.timestamp, mr.accuracy, mr.precision, 
                           mr.recall, mr.f1_score, m.model_type, m.hyperparameters, m.description AS model_description,
                           d.dataset_name, d.description AS dataset_description, d.created_at AS dataset_created_at
                    FROM model_runs mr
                    JOIN models m ON mr.model_version = m.model_version
                    JOIN datasets d ON mr.dataset_version = d.dataset_version
                    ORDER BY mr.timestamp DESC;
                """
                
        performance_history = [
            {
                "run_id": row["run_id"],
                "model_version": row["model_version"],
                "dataset_version": row["dataset_version"],
                "timestamp": row["timestamp"],
                "metrics": {
                    "accuracy": row["accuracy"],
                    "precision": row["precision"],
                    "recall": row["recall"],
                    "f1_score": row["f1_score"],
                    "loss": None  # Assuming loss is not available and setting it to null
                },
                "model_info": {
                    "model_type": row["model_type"],
                    "hyperparameters": row["hyperparameters"],
                    "description": row["model_description"]
                },
                "dataset_info": {
                    "dataset_name": row["dataset_name"],
                    "description": row["dataset_description"],
                    "created_at": row["dataset_created_at"]
                }
            }
            for row in execute_query(query).mappings()
        ]

        return jsonify(performance_history), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

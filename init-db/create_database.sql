DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_database
        WHERE datname = 'model_performance_db'
    ) THEN
        -- Create the database if it does not exist
        PERFORM dblink_exec('dbname=postgres user=postgres password=postgres', 'CREATE DATABASE model_performance_db');
    END IF;
END
$$;

-- Connect to the database
\c model_performance_db;

-- Create the `datasets` table
CREATE TABLE  IF NOT EXISTS datasets (
    dataset_version SERIAL PRIMARY KEY,  -- unique identifier for the dataset
    dataset_name VARCHAR(100) NOT NULL,
    storage_location VARCHAR(255),       -- path or URL where the dataset is stored
    description TEXT,                    -- description of the dataset
    created_at TIMESTAMP DEFAULT NOW()   -- timestamp when the dataset is added
);

-- Create the `models` table
CREATE TABLE IF NOT EXISTS models (
    model_version SERIAL PRIMARY KEY,    -- unique identifier for the model version
    model_type VARCHAR(100) NOT NULL,    -- e.g., "Logistic Regression", "Neural Network"
    hyperparameters JSONB,               -- JSON field to store model hyperparameters
    description TEXT,                    -- description of the model version
    created_at TIMESTAMP DEFAULT NOW()   -- timestamp when the model is created
);

-- Create the `model_runs` table
CREATE TABLE IF NOT EXISTS model_runs (
    run_id SERIAL PRIMARY KEY,                       -- unique identifier for each model evaluation run
    model_version INTEGER REFERENCES models(model_version),  -- foreign key to models table
    dataset_version INTEGER REFERENCES datasets(dataset_version),  -- foreign key to datasets table
    timestamp TIMESTAMP DEFAULT NOW(),               -- timestamp of the model run
    accuracy NUMERIC,                                -- model accuracy metric
    precision NUMERIC,                               -- model precision metric
    recall NUMERIC,                                  -- model recall metric
    f1_score NUMERIC,                                -- model F1 score metric
    loss NUMERIC                                     -- model loss metric
);

-- Insert into datasets only if the dataset doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM datasets WHERE dataset_name = 'Wine Quality Dataset') THEN
        INSERT INTO datasets (dataset_name, storage_location, description)
        VALUES
            ('Wine Quality Dataset', 's3://datasets/wine_quality.csv', 'Wine quality dataset for model training and evaluation');
    END IF;
END $$;

-- Insert into models only if the model doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM models WHERE model_type = 'Logistic Regression') THEN
        INSERT INTO models (model_type, hyperparameters, description)
        VALUES
            ('XGBoost', '{"objective": "multi:softmax", "num_class": 3, "eval_metric": "mlogloss", "random_state": 42}',  'Predicting wine quality based on red wine features. Using XGBoost for classification of quality into 3 categories: Low, Medium, High.');
    END IF;
END $$;

-- Insert into model_runs only if the run_id doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM model_runs WHERE run_id = 1) THEN
        INSERT INTO model_runs (model_version, dataset_version, accuracy, precision, recall, f1_score, loss)
        VALUES
            (1, 1, 0.85, 0.87, 0.84, 0.85, 0.4);
    END IF;
END $$;

-- Commit the transaction (optional, only if you're using a transactional approach)
COMMIT;



from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import Config

# Set up the database engine
engine = create_engine(Config.DATABASE_URL)
Session = sessionmaker(bind=engine)

def execute_query(query, params=None):
    with engine.connect() as conn:
        result = conn.execute(text(query), params or {})
        return result

def insert_model_run(data):
    query = """
        INSERT INTO model_runs (model_version, dataset_version, timestamp, accuracy, precision, recall, f1_score)
        VALUES (:model_version, :dataset_version, :timestamp, :accuracy, :precision, :recall, :f1_score)
    """
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            conn.execute(text(query), data)
            trans.commit()
        except Exception as e:
            trans.rollback()
            raise e


from locust import HttpUser, task, between
import random


class FastAPILoadTest(HttpUser):
    # Wait time between tasks
    wait_time = between(1, 2)  

    @task
    def test_predict_endpoint(self):
        #feature values for the model
        features = [7.4, 0.7, 0, 1.9, 0.076, 11, 34, 0.9978, 3.51, 0.56, 9.4]  
        model_version = "1"
        model_type = "Logistic Regression"

        # Send a POST request to the /predict endpoint
        with self.client.post(
            "/predict",
            json={
                "features": features,
                "model_version": model_version,
                "model_type": model_type,
            },
            catch_response=True,
        ) as response:
            # Log failed responses
            if response.status_code != 200:
                response.failure(f"Failed request: {response.text}")


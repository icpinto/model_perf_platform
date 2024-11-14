# Start from a Python 3.9 image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/model_performance_db"
ENV FASTAPI_URL="http://fastapi-app:8000/predict"

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Expose the port the app runs on
EXPOSE 5000

# Run the Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]


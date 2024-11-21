# Machine Learning Model Performance Evaluation Platform 

This project provides a comprehensive platform for machine learning model performance evalaution with new data. It includes **FastAPI** as the backend for model inference, **Flask** for handling business logic and database interactions, and a **React** frontend for user interaction. The system is optimized for performance, containerized with **Docker**, and monitored using **Prometheus**.

---

## Features

### Backend Services
- **FastAPI Application**:
  - Provides prediction functionality using pre-trained machine learning models.
  - Supports dynamic model selection by version and type.
  - Optimized with caching and asynchronous processing for better performance.
- **Flask Application**:
  - Handles routing, database connections, and user interactions.
  - Manages model-related metadata, encodings, and other business logic.
  
### Frontend Application
- **React Application**:
  - Allows users to upload CSV files and receive batch predictions.
  - Features model selection and performance visualization.
  - Displays historical performance and resource metrics with interactive charts.

### Monitoring and Load Testing
- **Prometheus**:
  - Collects and visualizes system metrics such as CPU, memory, and network usage.
- **Locust**:
  - Simulates user traffic for performance benchmarking and load testing.

### Containerization and Deployment
- **Docker**:
  - Ensures consistent environments for all application components.
- **Docker Compose**:
  - Simplifies multi-container orchestration for local and production environments.

---

## Project Structure

```plaintext
.github/workflows/docker-image.yml       # CI/CD pipeline configuration for building Docker images
.gitignore                               # Git ignore file for version control
docker-compose.yml                      # Docker Compose configuration for multi-container setup

# FastAPI Application
fastapiapp/
├── Dockerfile                          # FastAPI Dockerfile for containerization
├── config/process-exporter.yml         # Process exporter configuration for Prometheus
├── load-test/locustfile.py             # Locust load testing script
├── main.py                             # Main FastAPI application
├── models/                             # Directory for machine learning models
│   └── XGBoost_1.json                  # XGBoost model for inference
├── requirements.txt                    # Python dependencies for FastAPI
├── scalers/                            # Directory for feature scaling objects
│   └── XGBoost_1_scaler.pkl            # Pre-trained scaler for XGBoost model

# Flask Application
flaskapp/
├── Dockerfile                          # Flask Dockerfile for containerization
├── app.py                              # Main Flask application file
├── config.py                           # Configuration settings for Flask app
├── database.py                         # Database connection and logic
├── encoders/                           # Directory for label encoding objects
│   └── XGBoost_1_label_encoder.pkl     # Pre-trained label encoder for XGBoost
├── requirements.txt                    # Python dependencies for Flask
├── routes.py                           # Flask routes and API handling

# Database Initialization
init-db/
└── create_database.sql                 # SQL script for initializing the database schema

# Prometheus Monitoring
prometheus.yml                          # Prometheus configuration for monitoring system metrics

# React Application
reactapp/
├── .gitignore                          # Git ignore file for React project
├── Dockerfile                          # React Dockerfile for containerization
├── README.md                           # React project readme
├── nginx.conf                          # Nginx configuration for React app deployment
├── package-lock.json                   # NPM lock file
├── package.json                        # NPM dependencies for React
├── public/                             # Public static assets for the React app
│   ├── favicon.ico                     # Favicon for the app
│   ├── index.html                      # HTML entry point for the React app
│   ├── logo192.png                     # App icon for Android devices
│   ├── logo512.png                     # App icon for large devices
│   ├── manifest.json                   # Web app manifest for PWA functionality
│   └── robots.txt                      # Robots.txt file for search engines
├── src/                                # Source code for React app
│   ├── App.js                          # Main app component
│   ├── components/                     # React components for different features
│   │   ├── CSVUpload.js                # Component for uploading CSV files for predictions
│   │   ├── ModelSelector.js            # Dropdown for selecting models
│   │   ├── PerformanceHistory.js       # Component for displaying historical performance data
│   │   ├── PerformanceHistoryTable.js  # Component for displaying performance data in a table
│   │   ├── common/                     # Shared components
│   │       ├── FileInput.js            # File input component
│   │       ├── MetricCard.js           # Metric card component for displaying key metrics
│   │       ├── MetricChart.js          # Chart component for visualizing metrics
│   ├── hooks/                          # Custom React hooks
│   │   └── useFetch.js                 # Hook for fetching data from the API
│   ├── utils/                          # Utility functions for API and error handling
│   │   ├── api.js                      # API interaction functions
│   │   ├── errorHandler.js             # Error handling functions for React
│   ├── index.js                        # Entry point for the React app
│   ├── index.css                       # Global styles for React app
│   ├── setupTests.js                   # Test setup file
│   ├── reportWebVitals.js              # Web vitals reporting script
└── └── src/utils/api.js                # API utility functions
└── └── src/utils/errorHandler.js       # React error handling

---
## Installation and Setup

### Prerequisites
- **Docker** and **Docker Compose**
- **Node.js** and **npm** for the React frontend
- **Python 3.7+** for backend services (FastAPI, Flask)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/icpinto/model_perf_platform.git
   cd model_perf_platform
   
2. **Build and start the application with Docker Compose**:
   ```bash
   docker-compose up --build
   
3. **Access the application**:
-   Frontend (React): http://localhost:3000
---

## License

This project is licensed under the MIT License.
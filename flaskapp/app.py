from flask import Flask
from flask_cors import CORS
from routes import predict_blueprint, models_blueprint, history_blueprint
import config

app = Flask(__name__)
app.config.from_object(config.Config)

# Allow CORS for frontend interactions
CORS(app, origins=["http://localhost:3000"])

# Register blueprints for modular routes
app.register_blueprint(predict_blueprint)
app.register_blueprint(models_blueprint)
app.register_blueprint(history_blueprint)

if __name__ == '__main__':
    app.run(debug=True)


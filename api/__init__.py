# api/__init__.py

from flask import Flask
from .routes import api_bp
from .analysis import analysis_bp
from .results import results_bp
from .data_processing import data_processing_bp  # Import the data_processing blueprint

app = Flask(__name__)

# Register the Blueprints with the app
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
app.register_blueprint(results_bp, url_prefix='/api/results')
app.register_blueprint(data_processing_bp, url_prefix='/api/data_processing')  # Register the data_processing blueprint

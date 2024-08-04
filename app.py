# app.py

# Import the Flask class from the flask module
from flask import Flask
from flask_cors import CORS

# Import the Blueprint for the API routes
from api.routes import api_bp
from api.analysis import analysis_bp
from api.data_processing import data_processing_bp
from api.results import results_bp

# Create an instance of the Flask class
app = Flask(__name__)
CORS(app) 
# Register the API Blueprint
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
app.register_blueprint(results_bp, url_prefix='/api/results')
app.register_blueprint(data_processing_bp, url_prefix='/api/data_processing') 
# Define a route for the homepage
@app.route('/')
def hello_world():
    return 'Hello, World!'

# Run the app if this file is executed directly
if __name__ == '__main__':
    app.run(debug=True)

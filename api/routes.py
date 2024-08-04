# api/routes.py
from flask import Blueprint, jsonify
from .data_processing import fetch_stock_data,create_dataframe

api_bp = Blueprint('api', __name__)
# Import the Flask class and jsonify function
from flask import Blueprint, jsonify

# Create a Blueprint for the API routes
api_bp = Blueprint('api', __name__)

# Defining a route to fetch stock data
@api_bp.route('/stock_data')
def get_stock_data():
    try:
        stock_data = fetch_stock_data()
        if stock_data:
            df = create_dataframe(stock_data)  # Create the DataFrame
            return jsonify({'status': 'success', 'data': df.to_dict(orient='records')})
        else:
            return jsonify({'status': 'error', 'message': 'Failed to fetch stock data.'}), 500
    except Exception as e:
        # Handle any other potential exceptions that might occur
        return jsonify({'status': 'error', 'message': str(e)}), 500   
        # Continue with other API routes and responses
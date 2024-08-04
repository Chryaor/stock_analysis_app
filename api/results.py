from flask import Blueprint, jsonify,request
from .analysis import calculate_sma, calculate_ema  # Import the analysis functions from analysis.py

results_bp = Blueprint('results', __name__)

# Define routes to get analysis results

@results_bp.route('/moving_averages', methods=['GET'])
def get_moving_averages():
    # Get user inputs for SMA and EMA time periods from the query string
    sma_period = int(request.args.get('sma_period', 20))
    ema_period = int(request.args.get('ema_period', 20))

    # Calculate SMA and EMA using the analysis functions from analysis.py
    sma = calculate_sma(sma_period)
    ema = calculate_ema(ema_period)

    # Prepare the data to be sent to the frontend (you can choose to send the entire DataFrame or just relevant columns)
    moving_average_data = {
        'SMA': sma.tolist(),
        'EMA': ema.tolist()
    }

    return jsonify(moving_average_data)


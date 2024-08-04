from flask import Blueprint, request, jsonify
from .data_processing import create_dataframe,fetch_stock_data
import pandas as pd
import requests
analysis_bp = Blueprint('analysis', __name__)

# Function to calculate Simple Moving Average (SMA)
def calculate_sma(data, period):
    sma = data['4. close'].rolling(window=period).mean()
    sma = sma.dropna()
    return sma

# Function to calculate Exponential Moving Average (EMA)
def calculate_ema(data, period):
    ema = data['4. close'].ewm(span=period, adjust=False).mean()
    ema = ema.dropna()
    return ema

@analysis_bp.route('/moving_averages', methods=['GET'])
def moving_averages():
    # Get user inputs for SMA and EMA time periods from the query string
    sma_period = int(request.args.get('sma_period', 20))
    ema_period = int(request.args.get('ema_period', 20))

    # Assuming you have the stock data in the 'df' DataFrame (already processed in routes.py)
    stock_data = fetch_stock_data()
    df = create_dataframe(stock_data)
    # Calculate SMA and EMA
    sma = calculate_sma(df, sma_period)
    ema = calculate_ema(df, ema_period)

    # Prepare the data to be sent to the frontend (you can choose to send the entire DataFrame or just relevant columns)
    moving_average_data = {
        'Date': df['Date'].tolist(),
        'SMA': sma.tolist(),
        'EMA': ema.tolist()
    }

    return jsonify(moving_average_data)

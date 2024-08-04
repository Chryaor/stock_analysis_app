import pandas as pd
import requests
from flask import Blueprint, jsonify
data_processing_bp = Blueprint('data_processing', __name__)

# Define a route to fetch stock data and process it
@data_processing_bp.route('/process_stock_data', methods=['GET'])
def fetch_stock_data():

    # API endpoint URL with the necessary parameters
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=demo"

    # Make the API request
    response = requests.get(url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        stock_data = response.json()  # Convert the JSON response to a Python dictionary
        return stock_data
    else: 
        # Handle the case when the request fails
        print("Failed to fetch stock data.")
        return None
def create_dataframe(stock_data):
    monthly_time_series = stock_data['Monthly Time Series']

# Convert the nested dictionary to a list of dictionaries
    data_list = [{**{'Date': date}, **values} for date, values in monthly_time_series.items()]

# Create a Pandas DataFrame from the list of dictionaries
    df = pd.DataFrame(data_list)

# Convert the 'Date' column to datetime objects for easy manipulation
    df['Date'] = pd.to_datetime(df['Date'])

# Convert the 'open', 'high', 'low', 'close', and 'volume' columns to numeric data types
    numeric_columns = ['1. open', '2. high', '3. low', '4. close', '5. volume']
    df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric)
    return df

import yfinance as yf
import pandas as pd
from ta import momentum
import os

# Set the directory path
# Set the directory path
dir_path = os.path.dirname(os.path.realpath(__file__))
data_dir = os.path.join(dir_path, "data")

# Create "data" directory if it doesn't exist
if not os.path.exists(data_dir):
    os.makedirs(data_dir)

symbols = ["DX-Y.NYB"]  # Array of symbols

# Fetch data for each symbol
for symbol in symbols:
    # Download historical price data from 1/1/2020 to the current date
    data = yf.download(symbol, start="2019-12-14", end=pd.Timestamp.today().strftime("%Y-%m-%d"))

    # Calculate RSI
    data["RSI"] = momentum.rsi(data["Close"])

    # Create separate dataframes for price, volume, and RSI
    price_data = data[["Close"]]
    volume_data = data[["Volume"]]
    rsi_data = data[["RSI"]]

    # Save data to CSV files in the "data" directory
    price_data.to_csv(os.path.join(data_dir, f"{symbol}-price.csv"))
    volume_data.to_csv(os.path.join(data_dir, f"{symbol}-volume.csv"))
    rsi_data.to_csv(os.path.join(data_dir, f"{symbol}-rsi.csv"))

    #   # Read the saved CSV files
    # price_file_path = os.path.join(data_dir, f"{symbol}-price.csv")
    # volume_file_path = os.path.join(data_dir, f"{symbol}-volume.csv")
    # rsi_file_path = os.path.join(data_dir, f"{symbol}-rsi.csv")

    # price_df = pd.read_csv(price_file_path, index_col=0, parse_dates=True)
    # volume_df = pd.read_csv(volume_file_path, index_col=0, parse_dates=True)
    # rsi_df = pd.read_csv(rsi_file_path, index_col=0, parse_dates=True)

    # # Remove rows before 1/1/2020
    # price_df = price_df.loc["2020-01-01":]
    # volume_df = volume_df.loc["2020-01-01":]
    # rsi_df = rsi_df.loc["2020-01-01":]

    # # Save the updated dataframes back to CSV
    # price_df.to_csv(price_file_path)
    # volume_df.to_csv(volume_file_path)
    # rsi_df.to_csv(rsi_file_path)

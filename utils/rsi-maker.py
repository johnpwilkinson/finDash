import pandas as pd

def calculate_rsi(prices, volumes, window=14):
    # Calculate price changes
    delta = prices.diff()

    # Separate positive and negative price changes
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    # Calculate average gain and loss over the specified window
    avg_gain = gain.rolling(window=window).mean()
    avg_loss = loss.rolling(window=window).mean()

    # Calculate relative strength (RS) and relative strength index (RSI)
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    # Return the RSI series
    return rsi

# Read the historical price and volume data from CSV files
price_data = pd.read_csv('/Users/jp/Code/quant/js/getter/data/QQQ-price.csv')
volume_data = pd.read_csv('/Users/jp/Code/quant/js/getter/data/QQQ-volume.csv')

# Extract the relevant columns for calculations
prices = price_data['Price']
volumes = volume_data['Volume']

# Calculate the RSI
rsi = calculate_rsi(prices, volumes)

# Create a DataFrame for the date and RSI values
result = pd.DataFrame({'Date': price_data['Date'], 'RSI': rsi})

# Save the results to a new CSV file
result.to_csv('QQQ-rsi.csv', index=False)
print('RSI data saved to BTC-USD-rsi.csv')

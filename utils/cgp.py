import requests
import csv
import datetime

def get_unix_timestamp(date_str):
    date = datetime.datetime.strptime(date_str, "%d-%m-%Y")
    timestamp = int(date.timestamp())
    return timestamp

def get_historical_price(ticker):
    start_date_str = "14-12-2019"
    end_date_str = "26-06-2023"

    start_timestamp = get_unix_timestamp(start_date_str)
    end_timestamp = get_unix_timestamp(end_date_str)

    # Construct the API URL
    url = f"https://api.coingecko.com/api/v3/coins/{ticker}/market_chart/range?vs_currency=usd&from={start_timestamp}&to={end_timestamp}"

    # Send the API request
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        prices = data['prices']
        return prices
    else:
        print(f"Error: {response.status_code}")
        return None

def save_to_csv(data, filename):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Date', 'Price'])

        for price in data:
            date = datetime.datetime.fromtimestamp(price[0] / 1000).strftime('%Y-%m-%d')
            price_value = price[1]
            writer.writerow([date, price_value])

# Example usage
ticker = "ethereum"
filename = "/Users/jp/Code/quant/js/getter/data/ETH-USD-PRICE.csv"

price_data = get_historical_price(ticker)
if price_data:
    save_to_csv(price_data, filename)
    print(f"Data saved to {filename}")

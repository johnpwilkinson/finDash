import pandas as pd

def compute_volume_usd(price_file, volume_file, output_file):
    # Read the price and volume files
    price_df = pd.read_csv(price_file)
    volume_df = pd.read_csv(volume_file)

    # Merge the price and volume dataframes based on the 'Date' column
    merged_df = pd.merge(price_df, volume_df, on='Date')

    # Compute the daily volume in USD terms
    merged_df['Volume'] = merged_df['Price'] * merged_df['Volume']

    # Create a new dataframe with 'Date' and 'Volume_USD' columns
    volume_usd_df = merged_df[['Date', 'Volume']]

    # Save the computed volume data to a new CSV file
    volume_usd_df.to_csv(output_file, index=False)
    print(f"Daily volume in USD terms saved to {output_file}")

# Example usage
compute_volume_usd('/Users/jp/Code/quant/js/getter/data/ZN=F-price.csv', '/Users/jp/Code/quant/js/getter/data/ZN=F-volume.csv', '/Users/jp/Code/quant/js/getter/FINAL/ZN=F-VOL-USD.csv')

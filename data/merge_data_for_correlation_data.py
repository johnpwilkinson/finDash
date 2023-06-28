import pandas as pd
import glob

# Get the list of CSV files for each asset
csv_files = glob.glob('*-price.csv')  # Assumes the format of ASSETNAME-price.csv

# Create an empty DataFrame to store the combined sheet
combined_df = pd.DataFrame()

# Read and merge the CSV files based on date
for file in csv_files:
    asset_name = file.split('-')[0]  # Extract the asset name from the file name
    df = pd.read_csv(file)
    df['Date'] = pd.to_datetime(df['Date'])  # Convert date column to datetime type
    df = df.set_index('Date')  # Set date column as the index
    df.rename(columns={'Price': asset_name}, inplace=True)  # Rename the price column with asset name
    if combined_df.empty:
        combined_df = df
    else:
        combined_df = combined_df.join(df, how='outer')

# Sort the combined DataFrame by date
combined_df = combined_df.sort_index()

# Save the combined sheet to a new CSV file
combined_df.to_csv('combined_sheet.csv')

# Calculate the correlation matrix
corr_matrix = combined_df.corr()

# Save the correlation matrix to a CSV file
corr_matrix.to_csv('correlation_matrix.csv')

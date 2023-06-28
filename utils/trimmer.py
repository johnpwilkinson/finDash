import pandas as pd

def remove_rows_before_date(filepath, date):
    # Open the CSV file
    df = pd.read_csv(filepath)

    # Convert the 'Date' column to datetime format
    df['Date'] = pd.to_datetime(df['Date'])

    # Filter rows to keep only those on or after the specified date
    df = df[df['Date'] >= date]

    # Save the modified data back to the original CSV file
    df.to_csv(filepath, index=False)
    print(f"Rows before {date} removed and saved to {filepath}")

# Example usage
remove_rows_before_date('/Users/jp/Code/quant/js/getter/FINAL/SPY-volume.csv', '2020-01-01')

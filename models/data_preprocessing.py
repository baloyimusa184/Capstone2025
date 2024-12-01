import pandas as pd

def preprocess_meal_data(input_path, output_path):
    # Load the raw data
    raw_data = pd.read_csv(input_path)
    # Select relevant columns and clean data
    processed_data = raw_data[['meal', 'description']].dropna()
    processed_data.to_csv(output_path, index=False)

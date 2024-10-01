import csv
import math
import os

def split_csv(input_file, num_files):
    # Get the directory of the input file
    input_dir = os.path.dirname(input_file)
    
    # Read the input CSV file
    with open(input_file, 'r') as f:
        reader = csv.reader(f)
        data = list(reader)
    
    # Calculate the number of rows per file
    total_rows = len(data)
    rows_per_file = math.ceil(total_rows / num_files)
    
    # Split the data and write to new files
    for i in range(num_files):
        start_index = i * rows_per_file
        end_index = min((i + 1) * rows_per_file, total_rows)
        
        output_file = os.path.join(input_dir, f'output_{i+1}.csv')
        with open(output_file, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(data[start_index:end_index])
        
        print(f"Created {output_file}")

# Use the function with the specific file path
input_file_path = r'my-vite-app\src\mock-data\prd_Tutorial_1_AMPds2_29_09_2024_21_09_50.csv'
split_csv(input_file_path, 4)

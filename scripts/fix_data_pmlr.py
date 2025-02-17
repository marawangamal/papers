import csv
import pandas as pd
import ast  # Safer than eval for parsing lists

def fix_authors_field(csv_path: str):
    # Load the CSV file
    df = pd.read_csv(csv_path)

    # Ensure 'authors' column exists
    if 'authors' not in df.columns:
        print("Error: 'authors' column not found in CSV.")
        return

    def format_authors(authors_str):
        try:
            authors_list = ast.literal_eval(authors_str)  # Convert string to list safely
            if isinstance(authors_list, list):
                return '|'.join(authors_list)
        except (SyntaxError, ValueError):
            pass
        return authors_str  # Return unchanged if parsing fails

    # Apply transformation to the authors column
    df['authors'] = df['authors'].apply(format_authors)

    # Save the corrected CSV
    df.to_csv(csv_path, index=False)
    print(f"Fixed authors field in {csv_path}")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Fix authors field in papers.csv')
    parser.add_argument('papers_csv', help='Path to the papers.csv file', 
                        default="dumps/pmlr/papers.csv", nargs='?')
    args = parser.parse_args()

    fix_authors_field(args.papers_csv)

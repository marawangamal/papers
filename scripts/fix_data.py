import csv
from pathlib import Path
import pandas as pd
from tqdm import tqdm
import time
from scripts.scrape_neurips import NeuripsScraper

DELAY = 0.2  # Delay between requests

def fix_github_urls(papers_csv: str):
    """Update GitHub URLs in papers CSV using ConferenceScraper's extract_github_url method"""
    papers_path = Path(papers_csv)
    if not papers_path.exists():
        print(f"Error: {papers_csv} does not exist")
        return

    # Read CSV using pandas for easier manipulation
    df = pd.read_csv(papers_path)
    print(f"Found {len(df)} papers to process")

    # Initialize scraper
    scraper = NeuripsScraper(output_dir='dumps/misc')
    
    # Track updates
    updated_count = 0
    
    # Create progress bar
    pbar = tqdm(total=len(df), desc="Updating GitHub URLs", unit="paper")
    
    # Process each paper
    for idx, row in df.iterrows():
        try:
            # Extract GitHub URL using base scraper method
            github_url = scraper.extract_github_url(row['abstract'])
            
            if github_url:
                df.at[idx, 'code_url'] = github_url
                updated_count += 1
                
            pbar.update(1)
            pbar.set_postfix({"Updated": updated_count})
            
        except Exception as e:
            print(f"\nError processing paper '{row['title']}': {str(e)}")
            continue
    
    pbar.close()
    
    # Save updated DataFrame back to CSV
    df.to_csv(papers_path, index=False)
    print(f"\nCompleted processing. Updated {updated_count} papers with GitHub URLs")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Update GitHub URLs in papers.csv')
    parser.add_argument('papers_csv', help='Path to the papers.csv file', 
                       default="dumps/icml/papers.csv", nargs='?')
    args = parser.parse_args()
    
    fix_github_urls(args.papers_csv)
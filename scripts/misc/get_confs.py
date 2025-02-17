import json
import csv
from string import ascii_lowercase
import requests
from urllib.parse import urlencode
import time

def scrape_conferences(output_file: str = 'conferences.csv', delay: float = 1.0) -> None:
    """
    Scrape conference invitations from OpenReview API and save directly to CSV with
    columns: id, readers, json
    
    Args:
        output_file: Name of output CSV file
        delay: Time to wait between requests in seconds
    """
    base_url = "https://api2.openreview.net/invitations"
    total_count = 0
    
    # Initialize CSV file with headers
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'readers', 'json'])
    
    for letter in ascii_lowercase:
        params = {'prefix': letter}
        url = f"{base_url}?{urlencode(params)}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            
            data = response.json()
            if 'invitations' in data:
                print(f"Fetched {len(data['invitations'])} invitations for prefix: {letter} ")
                invitations = data['invitations']
                total_count += len(invitations)
                
                # Write each invitation to CSV
                with open(output_file, 'a', newline='') as f:
                    writer = csv.writer(f)
                    for inv in invitations:
                        writer.writerow([
                            inv.get('id', ''),
                            ';'.join(inv.get('edit', {}).get('readers', [])),  # Join readers with semicolon
                            json.dumps(inv)  # Full invitation as JSON string
                        ])
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching prefix {letter}: {e}")
        
        time.sleep(delay)  # Be nice to the API
    
    print(f"Found {total_count} invitations")
    print(f"Results saved to {output_file}")

if __name__ == "__main__":
    scrape_conferences()
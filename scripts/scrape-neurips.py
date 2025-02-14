import requests
from bs4 import BeautifulSoup
import csv
from pathlib import Path
import time
import re
from typing import List, Dict, Optional
from urllib.parse import urljoin
from tqdm import tqdm

DELAY = 0.2  # Delay between requests

class NeurIPSScraper:
    def __init__(self, output_dir: str = 'data'):
        self.base_url = "https://papers.nips.cc"
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.session = requests.Session()
        
        # Create CSV files with headers
        self.setup_csv_files()
        
    def setup_csv_files(self):
       # Setup venues CSV
        venues_path = self.output_dir / 'venues.csv'
        if not venues_path.exists():  # Only write headers if file doesn't exist
            with open(venues_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['name', 'abbrev', 'year', 'editors', 'isbn'])

        # Setup papers CSV
        papers_path = self.output_dir / 'papers.csv'
        if not papers_path.exists():  # Only write headers if file doesn't exist
            with open(papers_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['title', 'authors', 'abstract', 'venue_abbrev', 'venue_year', 'pdf_url', 'code_url'])


    def get_metadata_from_citation_tags(self, soup: BeautifulSoup) -> Dict:
        """Extract metadata from citation meta tags"""
        metadata = {}
        
        # Get title
        title_tag = soup.find('meta', {'name': 'citation_title'})
        metadata['title'] = title_tag['content'] if title_tag else ''
        
        # Get authors
        author_tags = soup.find_all('meta', {'name': 'citation_author'})
        metadata['authors'] = [tag['content'] for tag in author_tags]
        
        # Get PDF URL
        pdf_tag = soup.find('meta', {'name': 'citation_pdf_url'})
        metadata['pdf_url'] = pdf_tag['content'] if pdf_tag else None
        
        return metadata

    def scrape_paper_details(self, paper_url: str) -> Dict:
        """Scrape individual paper page"""
        full_url = urljoin(self.base_url, paper_url)
        response = self.session.get(full_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Get metadata from citation tags
        metadata = self.get_metadata_from_citation_tags(soup)
        
        # Get abstract - find the h4 header and get the next p tag
        abstract_header = soup.find('h4', text=re.compile('Abstract', re.IGNORECASE))
        if abstract_header and abstract_header.find_next('p'):
            metadata['abstract'] = abstract_header.find_next('p').text.strip()
        else:
            metadata['abstract'] = ''
        
        # Look for code link in buttons or regular links
        metadata['code_url'] = None
        for link in soup.find_all('a'):
            href = link.get('href', '')
            text = link.text.strip().lower()
            if 'code' in text or 'github' in href.lower():
                metadata['code_url'] = href
                break
        
        return metadata

    def scrape_year(self, year: int):
        """Scrape all papers for a given year"""
        print(f"Scraping NeurIPS {year}...")
        
        # Get the year's proceedings page
        url = f"{self.base_url}/paper/{year}"
        response = self.session.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Get venue information
        header = soup.find('h4')
        if header:
            venue_name = header.text.strip()
            # Extract editors and ISBN
            editors = ""
            isbn = ""
            for div in soup.find_all('div', style="width:100%"):
                text = div.text.strip()
                if "Edited by:" in text:
                    editors = text.replace("Edited by:", "").strip()
                elif "ISBN:" in text:
                    isbn = text.replace("ISBN:", "").strip()
            
            # Save venue information
            with open(self.output_dir / 'venues.csv', 'a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['Neural Information Processing Systems', 'NeurIPS', year, editors, isbn])

        # Find all paper entries
        paper_list = soup.find('ul', class_='paper-list')
        if not paper_list:
            print(f"No papers found for year {year}")
            return

        papers = paper_list.find_all('li')
        pbar = tqdm(total=len(papers), desc=f"Year {year}", unit="paper", leave=False)
        
        papers_processed = 0
        for li in papers:
            try:
                # Get paper link
                paper_link = li.find('a')
                if not paper_link:
                    continue
                
                # Get paper details from the abstract page
                paper_data = self.scrape_paper_details(paper_link['href'])
                
                # Write to CSV
                with open(self.output_dir / 'papers.csv', 'a', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    writer.writerow([
                        paper_data['title'],
                        '|'.join(paper_data['authors']),  # Join authors with pipe separator
                        paper_data['abstract'],
                        'NeurIPS',
                        year,
                        paper_data['pdf_url'],
                        paper_data['code_url']
                    ])
                
                papers_processed += 1
                pbar.update(1)
                pbar.set_postfix({"Processed": papers_processed})
                
                # Be nice to the server
                time.sleep(DELAY)
                
            except Exception as e:
                print(f"\nError processing paper: {str(e)}")
                continue
        
        pbar.close()
        print(f"\nCompleted year {year}, processed {papers_processed} papers")

    def scrape_multiple_years(self, years: List[int]):
        """Scrape papers from multiple years"""
        for year in years:
            self.scrape_year(year)

# Usage example
if __name__ == "__main__":
    scraper = NeurIPSScraper(output_dir='dumps/neurips')
    
    # Scrape papers from recent years
    years_to_scrape = [i for i in range(2021, 1988, -1)]
    scraper.scrape_multiple_years(years_to_scrape)
"""This script only works on the latest ICML website (2020-present)

Use the endpoint `/static/virtual/data/icml-{year}-orals-posters.json` to fetch paper data
"""
import time
from typing import List, Dict, Optional
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from tqdm import tqdm

from base import ConferenceScraper  # Use absolute import


class NeuripsScraper(ConferenceScraper):
    """Neurips conference paper scraper"""
    
    @property
    def base_url(self) -> str:
        return "https://papers.nips.cc"
    
    @property
    def conference_name(self) -> str:
        return "ICML"
    
    @property
    def full_conference_name(self) -> str:
        return "International Conference on Machine Learning"
    
    # def get_paper_data(self, paper_url: str) -> Dict:
    #         """Scrape individual paper page"""
    #         full_url = urljoin(self.base_url, paper_url)
    #         response = self.session.get(full_url)
    #         soup = BeautifulSoup(response.text, 'html.parser')
            
    #         # Get metadata from citation tags
    #         metadata = self.get_metadata_from_citation_tags(soup)
            
    #         # Get abstract - find the h4 header and get the next p tag
    #         abstract_header = soup.find('h4', text=re.compile('Abstract', re.IGNORECASE))
    #         if abstract_header and abstract_header.find_next('p'):
    #             metadata['abstract'] = abstract_header.find_next('p').text.strip()
    #         else:
    #             metadata['abstract'] = ''
            
    #         # Look for code link in buttons or regular links
    #         metadata['code_url'] = None
    #         for link in soup.find_all('a'):
    #             href = link.get('href', '')
    #             text = link.text.strip().lower()
    #             if 'code' in text or 'github' in href.lower():
    #                 metadata['code_url'] = self.fix_url(href)
    #                 break

    
    # def get_paper_data(self, year: int) -> List[Dict]:
    #     """Fetch paper data from JSON endpoint"""
    #     try:
    #         response = self.make_request(f"/paper/{year}")
    #         return response.json()['results']
    #     except Exception as e:
    #         print(f"Error fetching papers for year {year}: {str(e)}")
    #         return []

    
    def scrape_year(self, year: int):
        """Scrape all papers for a given year"""
        print(f"Scraping {self.conference_name} {year}...")
        
        # Save venue information
        self.save_venue_info(year)
        
        # Get the year's proceedings page
        url = f"{self.base_url}/v{year}"
        response = self.session.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        papers = soup.find_all('div', class_='paper')

        with tqdm(total=len(papers), desc=f"Year {year}", unit="paper") as pbar:
            for paper in papers:
                try:
                    print(paper)
                    # urls = self.get_paper_data(paper)
                    # paper_data = {
                    #     'title': paper.get('name', ''),
                    #     'authors': [author['fullname'] for author in paper.get('authors', [])],
                    #     'abstract': paper.get('abstract', ''),
                    #     'pdf_url': paper.get('paper_pdf_url'),
                    #     'code_url': urls['code_url']
                    # }
                    # paper_data = self.get_paper_data(paper)
                    # self.save_paper_info(paper_data, year)
                    # pbar.update(1)
                    # time.sleep(self.delay)
                    
                except Exception as e:
                    print(f"\nError processing paper: {str(e)}")
                    continue

# Usage example
if __name__ == "__main__":
    # Scrape ICML papers
    icml_scraper = NeuripsScraper(output_dir='dumps/icml')
    icml_scraper.scrape_multiple_years(list(range(2024, 2020, -1)))
import re
import time
from typing import Dict, Optional
from bs4 import BeautifulSoup
from tqdm import tqdm

from base import ConferenceScraper  # Use absolute import

venue2abbrevMap = {
    "International Conference on Artificial Intelligence and Statistics": "AISTATS",
    "International Conference on Machine Learning": "ICML",
    "International Conference on Grammatical Inference": "ICGI",
    "Conference on Robot Learning": "CoRL",
    "Probabilistic Graphical Models": "PGM",
    "Conference on Learning Theory": "COLT",
    # "Neural Information Processing Systems": "NuerIPS",
    # "Advances in Neural Information Processing Systems": "NeurIPS",
    # "International Conference on Learning Representations": "ICLR",
    # "Uncertainty in Artificial Intelligence": "UAI",
    # "Algorithmic Learning Theory": "ALT",
    # "International Workshop on Artificial Intelligence and Statistics": "AISTATS",  # older name
    # "Gaussian Processes in Practice": "GPIP",  # Note: This is my best guess
    # "Journal of Machine Learning Research": "JMLR",
    # "Empirical Methods in Natural Language Processing": "EMNLP",
    # "International Conference on Computational Learning Theory": "COLT",
    # "Conference on Knowledge Discovery and Data Mining": "KDD",
    # "International Joint Conference on Artificial Intelligence": "IJCAI",
    # "AAAI Conference on Artificial Intelligence": "AAAI",
}


class Scraper(ConferenceScraper):
    
    @property
    def base_url(self) -> str:
        return "https://proceedings.mlr.press"

    def get_venue(self, year: int) -> Optional[Dict]:
        """Get venue information"""
        url = f"{self.base_url}/v{year}"
        response = self.session.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        venue = soup.find('h2')
        print(f"Venue: {venue}")
        try:
            # Pattern handles:
            # "Volume 89: The 22nd International Conference..." 
            pattern = r"Volume \d+: (?:The \d+(?:st|nd|rd|th) )?(.*?)(?:,\s*\d+)"
            # Simple pattern just for year
            year_pattern = r",.*?(\d{4})"
            match = re.search(pattern, venue.text)
            year_match = re.search(year_pattern, venue.text)

            if match and year_match:
                title = match.group(1)
                return {
                    "title": title,
                    "abbrev": venue2abbrevMap[title],
                    "year": int(year_match.group(1))
                }
        except:
            return None

    def get_paper(self, url: str, venue: Dict) -> Dict:
        # Extract:
        # title,authors,abstract,venue_abbrev,venue_year,pdf_url,code_url
        response = self.session.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        abstract = next(iter(soup.find('div', id='abstract').children))
        # Find <a> containing text PDF orDownload PDF or anything similar
        pdf_link = soup.find('a', text=re.compile('Download PDF', re.IGNORECASE))
        code_link = soup.find('a', text=re.compile('Code', re.IGNORECASE))
        title = soup.find('title').text
        # Extract and clean authors
        authors_text = soup.find('span', class_='authors').text
        # Remove special characters and multiple spaces
        authors_text = re.sub(r'\s+', ' ', authors_text)
        authors = [author.strip() for author in authors_text.split(',')]    
        if "High Dimensional Regression with Binary Coefficients" in title:
            print(authors)   
        return {
            "title": title,
            "authors":authors,
            "abstract": abstract,
            "venue_abbrev": venue['abbrev'],
            "venue_year": venue['year'],
            "pdf_url": pdf_link.get('href') if pdf_link else None,
            "code_url": code_link.get('href') if code_link else None
        }
    
    def scrape_year(self, year: int):
        """Scrape all papers for a given year"""
        print(f"Scraping {year}...")
        
        # Get the year's proceedings page
        url = f"{self.base_url}/v{year}"
        response = self.session.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        papers = soup.find_all('div', class_='paper')
        venue = self.get_venue(year)
        if not venue:
            print(f"Error fetching venue information for year {year}")
            return
        self.save_venue(venue)
    

        with tqdm(total=len(papers), desc=f"Year {year}", unit="paper") as pbar:
            for paper in papers:
                try:
                    paper_link = paper.find('a')
                    paper_data = self.get_paper(paper_link.get('href'), venue)
                    self.save_paper(paper_data)
                    pbar.update(1)
                    time.sleep(self.delay)
                    
                except Exception as e:
                    print(f"\nError processing paper: {str(e)}")
                    continue

# Usage example
if __name__ == "__main__":
    # Scrape ICML papers
    scraper = Scraper(output_dir='dumps/pmlr2')
    scraper.scrape_multiple_years(list(range(0,  263, 1)))
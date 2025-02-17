"""Abstract base class for conference paper scrapers

This module provides an abstract base class for conference paper scrapers.
It defines the interface for scraping conference papers and saving them to CSV files.

Example:

    class MyScraper(ConferenceScraper):

        def scrape_year(self, year: int):
            # Implement scraping logic here
            # You need to get the `venue` and `paper_data` dictionaries

            venue = get_venue(year)  # Should return a dict with keys ['title', 'abbrev', 'year']
            self.save_venue(venue)

            paper_data = get_paper_data() // Should return a dict with kyes ['title', 'authors', 'abstract', 'venue_abbrev', 'venue_year', 'pdf_url', 'code_url]
            self.save_paper(paper)
        
"""
from abc import ABC, abstractmethod
import requests
import csv
from pathlib import Path
from typing import List, Dict, Optional
import re

class ConferenceScraper(ABC):
    """Base class for conference paper scrapers"""
    
    def __init__(self, output_dir: str = 'data'):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.session = requests.Session()
        self.delay = 0.2  # Default delay between requests
        
        # Setup CSV files
        self.setup_csv_files()


    def setup_csv_files(self):
        """Setup CSV files with appropriate headers"""
        # Setup venues CSV
        venues_path = self.output_dir / 'venues.csv'
        if not venues_path.exists():
            with open(venues_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['name', 'abbrev', 'year'])

        # Setup papers CSV
        papers_path = self.output_dir / 'papers.csv'
        if not papers_path.exists():
            with open(papers_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([
                    'title', 'authors', 'abstract', 'venue_abbrev', 
                    'venue_year', 'pdf_url', 'code_url'
                ])

    def save_venue(self, venue: Dict):
        """Save venue information for the given year"""
        with open(self.output_dir / 'venues.csv', 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                venue['title'],
                venue['abbrev'],
                venue['year'],
            ])


    def save_paper(self, paper_data: Dict):
        """Save paper information to CSV"""
        with open(self.output_dir / 'papers.csv', 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                paper_data.get('title', ''),
                '|'.join(paper_data.get('authors', [])),
                paper_data.get('abstract', ''),
                paper_data.get('venue_abbrev', ''),
                paper_data.get('venue_year', ''),
                paper_data.get('pdf_url'),
                paper_data.get('code_url')
            ])


    def scrape_multiple_years(self, years: List[int]):
        """Scrape papers from multiple years"""
        for year in years:
            try:
                self.scrape_year(year)
            except Exception as e:
                print(f"Error processing year {year}: {str(e)}")
    
    def extract_github_url(self, text: str) -> Optional[str]:
        """Extract GitHub URL from text"""
        github_urls = re.findall(r'https?://github\.com/[^\s)+\]]+', text.lower())
        return github_urls[0].rstrip('.') if github_urls else None

    @abstractmethod
    def scrape_year(self, year: int):
        """Scrape all papers for a given year"""
        pass
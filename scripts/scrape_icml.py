import re
from typing import Dict, Optional

import requests
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

from dataclasses import dataclass, field, fields
from typing import List, Dict, Optional, Any


@dataclass
class ICMLPaper:
    # ─── basic metadata ──────────────────────────────────────────────────────────
    id: int
    uid: str
    name: str
    abstract: str

    # ─── rich content & authorship ───────────────────────────────────────────────
    authors: List[Dict[str, Any]] = field(default_factory=list)
    topic: Optional[str] = None
    keywords: List[str] = field(default_factory=list)

    # ─── review / session info ───────────────────────────────────────────────────
    decision: Optional[str] = None
    session: Optional[str] = None
    eventtype: Optional[str] = None  # ICML uses both spellings
    event_type: Optional[str] = None
    room_name: Optional[str] = None

    # ─── URLs & references ───────────────────────────────────────────────────────
    virtualsite_url: Optional[str] = None
    url: Optional[str] = None
    sourceid: Optional[int] = None
    sourceurl: Optional[str] = None
    paper_url: Optional[str] = None
    paper_pdf_url: Optional[str] = None

    # ─── timing ─────────────────────────────────────────────────────────────────
    starttime: Optional[str] = None  # strings keep the original TZ offset
    endtime: Optional[str] = None
    starttime2: Optional[str] = None
    endtime2: Optional[str] = None

    # ─── hierarchy / children ───────────────────────────────────────────────────
    diversity_event: Optional[str] = None
    children_url: Optional[str] = None
    children: List[Dict[str, Any]] = field(default_factory=list)
    children_ids: List[int] = field(default_factory=list)
    parent1: Optional[str] = None
    parent2: Optional[str] = None
    parent2_id: Optional[int] = None

    # ─── media, map & relations ─────────────────────────────────────────────────
    eventmedia: List[Dict[str, Any]] = field(default_factory=list)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    related_events: List[Dict[str, Any]] = field(default_factory=list)
    related_events_ids: List[int] = field(default_factory=list)

    # ─── display flags ──────────────────────────────────────────────────────────
    show_in_schedule_overview: bool = False
    visible: bool = True
    poster_position: Optional[str] = None
    schedule_html: Optional[str] = None

    # ─── helper constructor ─────────────────────────────────────────────────────
    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "ICMLPaper":
        """Create a PaperEvent, ignoring any keys we didn't model."""
        allowed = {f.name for f in fields(cls)}
        filtered = {k: v for k, v in d.items() if k in allowed}
        return cls(**filtered)


class Scraper(ConferenceScraper):

    def _get_base_url(self, year: int) -> str:
        return f"https://icml.cc/static/virtual/data/icml-{year}-orals-posters.json"

    def _get_venue(self, year: int) -> Dict:
        """Get venue information"""
        assert year in [
            2016 + i for i in range(10)
        ], "Year must be between 2016 and 2025"
        title = "International Conference on Machine Learning"
        return {
            "title": title,
            "abbrev": venue2abbrevMap[title],
            "year": year,
        }

    def _parse_paper(self, url: str, venue: Dict) -> Dict:
        # Extract:
        # title,authors,abstract,venue_abbrev,venue_year,pdf_url,code_url
        response = self.session.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        abstract = next(iter(soup.find("div", id="abstract").children))
        # Find <a> containing text PDF orDownload PDF or anything similar
        pdf_link = soup.find("a", text=re.compile("Download PDF", re.IGNORECASE))
        code_link = soup.find("a", text=re.compile("Code", re.IGNORECASE))
        title = soup.find("title").text
        # Extract and clean authors
        authors_text = soup.find("span", class_="authors").text
        # Remove special characters and multiple spaces
        authors_text = re.sub(r"\s+", " ", authors_text)
        authors = [author.strip() for author in authors_text.split(",")]
        if "High Dimensional Regression with Binary Coefficients" in title:
            print(authors)
        return {
            "title": title,
            "authors": authors,
            "abstract": abstract,
            "venue_abbrev": venue["abbrev"],
            "venue_year": venue["year"],
            "pdf_url": pdf_link.get("href") if pdf_link else None,
            "code_url": code_link.get("href") if code_link else None,
        }

    # NOTE: this is the only method that needs ot be defined according to the base class
    def scrape_year(self, year: int):
        """Scrape all papers for a given year"""
        print(f"Scraping {year}...")
        url = self._get_base_url(year)
        response = requests.get(url).json()
        papers = response["results"]

        venue = self._get_venue(year)
        self.save_venue(venue)
        with tqdm(total=len(papers), desc=f"Year {year}", unit="paper") as pbar:
            for paper in papers:
                paper_ = ICMLPaper.from_dict(paper)
                try:

                    paper_data = {
                        "title": paper_.name,
                        "authors": [author["fullname"] for author in paper_.authors],
                        "abstract": paper_.abstract,
                        "pdf_url": paper_.paper_url,
                        "code_url": paper_.sourceurl,
                        # venue
                        "venue_abbrev": venue["abbrev"],
                        "venue_year": venue["year"],
                    }
                    self.save_paper(paper_data)
                    pbar.update(1)

                except Exception as e:
                    print(f"\nError processing paper: {str(e)}")
                    continue


# Usage example
if __name__ == "__main__":
    # Scrape ICML papers
    scraper = Scraper(output_dir="dumps/icml")
    scraper.scrape_year(2025)

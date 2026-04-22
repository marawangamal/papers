import re
from datetime import datetime
from typing import Dict, Optional

import requests
from tqdm import tqdm

from base import ConferenceScraper  # Use absolute import
from dataclasses import dataclass, field, fields
from typing import List, Dict, Optional, Any

venue2abbrevMap = {
    "International Conference on Artificial Intelligence and Statistics": "AISTATS",
    "International Conference on Machine Learning": "ICML",
    "International Conference on Grammatical Inference": "ICGI",
    "Conference on Robot Learning": "CoRL",
    "Probabilistic Graphical Models": "PGM",
    "Conference on Learning Theory": "COLT",
    "Neural Information Processing Systems": "NeurIPS",
    "International Conference on Learning Representations": "ICLR",
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

abbrev2venueMap = {v: k for k, v in venue2abbrevMap.items()}


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
    def __init__(self, conf: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.conf = conf
        # NOTE: this scraper only works for ICML, NeurIPS, and ICLR. To add support for other conferences, 
        # inherit from the base class and override the `scrape_year` method.
        assert conf.lower() in ['icml', 'neurips', 'iclr'], f"This scraper only works for ICML, NeurIPS, and ICLR"

    def _get_base_url(self, conf: str, year: int) -> str:
        conf = conf.lower()
        return f"https://{conf}.cc/static/virtual/data/{conf}-{year}-orals-posters.json"

    def _get_venue(self, year: int) -> Dict:
        """Get venue information"""
        current_year = datetime.now().year
        assert (
            2016 <= year <= current_year
        ), f"Year must be between 2016 and {current_year}"
        title = abbrev2venueMap[self.conf]
        return {
            "title": title,
            "abbrev": venue2abbrevMap[title],
            "year": year,
        }

    @staticmethod
    def _to_code_url(url: Optional[str], abstract: Optional[str]) -> Optional[str]:
        """A code URL advertised in the abstract is a strong signal, so check there
        first; fall back to the feed's `url` field (project link)."""
        if abstract:
            code_hosts = ("github.com", "gitlab.com", "huggingface.co", "bitbucket.org")
            for u in re.findall(r"https?://[^\s)>\]]+", abstract):
                if any(h in u for h in code_hosts):
                    return u.rstrip(".,")
        return url

    # NOTE: this is the only method that needs ot be defined according to the base class
    def scrape_year(self, year: int):
        """Scrape all papers for a given year"""
        print(f"Scraping {year}...")
        url = self._get_base_url(self.conf, year)
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
                        "pdf_url": paper_.paper_url.replace("/forum?", "/pdf?") if paper_.paper_url else None,
                        "code_url": self._to_code_url(paper_.url, paper_.abstract),
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
    for year in range(2025, 2026):
        scraper = Scraper(conf="ICML", output_dir=f"dumps/icml-{year}")
        scraper.scrape_year(year)

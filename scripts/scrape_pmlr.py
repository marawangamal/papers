import re
from typing import Dict, Optional

import bibtexparser
import requests
from bibtexparser.bparser import BibTexParser
from bibtexparser.customization import convert_to_unicode
from tqdm import tqdm

from base import ConferenceScraper  # Use absolute import

venue2abbrevMap = {
    "International Conference on Artificial Intelligence and Statistics": "AISTATS",
    "International Conference on Machine Learning": "ICML",
    "International Conference on Grammatical Inference": "ICGI",
    "Conference on Robot Learning": "CoRL",
    "Probabilistic Graphical Models": "PGM",
    "Conference on Learning Theory": "COLT",
}

abbrev2venueMap = {v: k for k, v in venue2abbrevMap.items()}


class Scraper(ConferenceScraper):
    def __init__(self, conf: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # NOTE: this scraper only works for the conferences in venue2abbrevMap. To add support
        # for other conferences, add them to the map.
        canonical = {k.lower(): k for k in abbrev2venueMap}
        assert conf.lower() in canonical, f"This scraper only works for {list(abbrev2venueMap)}"
        self.conf = canonical[conf.lower()]

    def _get_base_url(self, volume: int) -> str:
        return f"https://proceedings.mlr.press/v{volume}/assets/bib/bibliography.bib"

    def _get_volume(self, year: int) -> Optional[int]:
        """Look up the PMLR volume number for (self.conf, year) from the index page."""
        if not hasattr(self, "_index"):
            html = requests.get("https://proceedings.mlr.press/").text
            # Each listed volume line looks like:
            # <li><a href="v258"><b>Volume 258</b></a> Proceedings of AISTATS 2025</li>
            self._index = {
                (abbrev, int(yr)): int(vol)
                for vol, abbrev, yr in re.findall(
                    r'href="v(\d+)".*?Proceedings of (\w+)\s+(\d{4})',
                    html,
                )
            }
        return self._index.get((self.conf, year))

    def _get_venue(self, entries: list) -> Optional[Dict]:
        """Resolve (title, abbrev, year) from the BibTeX entries of a volume."""
        proc = next((e for e in entries if e.get("ENTRYTYPE") == "proceedings"), None)
        papers = [e for e in entries if e.get("ENTRYTYPE") == "inproceedings"]
        if not proc or not papers:
            return None
        title = next((t for t in venue2abbrevMap if t in proc.get("booktitle", "")), None)
        if not title or venue2abbrevMap[title] != self.conf:
            return None
        return {"title": title, "abbrev": self.conf, "year": int(papers[0]["year"])}

    @staticmethod
    def _to_code_url(url: Optional[str], abstract: Optional[str]) -> Optional[str]:
        """A code URL advertised in the abstract is a strong signal, so check there
        first; fall back to the feed's `url` field (project link)."""
        if abstract:
            code_hosts = ("github.com", "gitlab.com", "huggingface.co", "bitbucket.org")
            for u in re.findall(r"https?://[^\s)>\]}]+", abstract):
                if any(h in u for h in code_hosts):
                    return u.rstrip(".,;:")
        return url

    # NOTE: this is the only method that needs to be defined according to the base class.
    def scrape_year(self, year: int):
        """Scrape all papers for a given calendar year of self.conf."""
        print(f"Scraping {self.conf} {year}...")
        volume = self._get_volume(year)
        if volume is None:
            print(f"Skipping {self.conf} {year}: no PMLR volume found")
            return

        parser = BibTexParser(common_strings=True)
        parser.customization = convert_to_unicode
        db = bibtexparser.loads(requests.get(self._get_base_url(volume)).text, parser=parser)

        venue = self._get_venue(db.entries)
        if not venue:
            print(f"Skipping v{volume}: not {self.conf}")
            return

        papers = [e for e in db.entries if e.get("ENTRYTYPE") == "inproceedings"]
        self.save_venue(venue)
        with tqdm(total=len(papers), desc=f"{self.conf} {year}", unit="paper") as pbar:
            for paper in papers:
                try:
                    paper_data = {
                        "title": paper.get("title", ""),
                        "authors": [" ".join(reversed(a.split(", "))) for a in paper.get("author", "").split(" and ")],
                        "abstract": paper.get("abstract"),
                        "pdf_url": paper.get("pdf"),
                        "code_url": self._to_code_url(None, paper.get("abstract")),
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
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--conf", required=True)
    parser.add_argument("--years", required=True, nargs="+", type=int)
    args = parser.parse_args()

    scraper = Scraper(conf=args.conf, output_dir=f"dumps/{args.conf.lower()}")
    scraper.scrape_multiple_years(args.years)

# [Paperz.io](https://paperz.vercel.app/search/7546)

A semantic search engine for academic papers from major ML conferences.

## Supported conferences

- [x] NeurIPS
- [x] ICML
- [x] PMLR (AISTATS, COLT, CoRL,ICGI)
- [ ] ICLR

## Features

- [x] Search papers using natural language queries
- [ ] Reverse search using papers
- [ ] Mars

## Contributing a scraper

To add a new conference, you must make a script that produces these two csvs:

- `venues.csv` (name, abbrev, year)
- `papers.csv` (title, authors, abstract, venue_abbrev, venue_year, pdf_url, code_url)

You can create the script from scratch or use the [ConferenceScraper](scripts/base.py) base class to help you. Here's a simple Example:

```python
from base import ConferenceScraper

class MyScraper(ConferenceScraper):
    # You just need to implement `get_venue` and `get_papers`

    def get_venue(self, year):
        # Implement this...

    def get_papers(self, venue):
        # Implement this...

    def scrape_year(self, year: int):
        venue = get_venue(year) # Dict with keys: [name, abbrev, year]
        self.save_venue(venue)
        for paper in get_papers(venue):  # Dict with keys: [title, authors, abstract, venue_abbrev, venue_year, pdf_url, code_url]
            self.save_paper(paper)

if __name__ == '__main__':
    scraper = MyScraper(output_dir='data')
    scraper.scrape_multiple_years([2020, 2021])

```

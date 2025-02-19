# [Paperz.io](https://paperz.vercel.app/search/7546)

A semantic search engine for academic papers from major ML conferences.

## Supported conferences

- [x] NeurIPS
- [x] ICML
- [x] PMLR (AISTATS, COLT, CoRL,ICGI)
- [ ] ICLR

## Features

- [x] Search papers using natural language queries
- [ ] Reverse search using a paper (graph visualization)

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
         # Must return a dict with keys: [name, abbrev, year]

    def get_papers(self, venue):
        # Implement this...
        # Must return a dict with keys: [title, authors, abstract, venue_abbrev, venue_year, pdf_url, code_url]

    def scrape_year(self, year: int):
        venue = get_venue(year) # Dict with keys:
        self.save_venue(venue)
        for paper in get_papers(venue):
            self.save_paper(paper)

if __name__ == '__main__':
    scraper = MyScraper(output_dir='dumps')
    scraper.scrape_multiple_years([2020, 2021])

```

## Local Development

This will get a local instance of the app running, with sample data.

### Prerequisites
- Node.js
- npm
- Docker

### Steps

1. Clone and install
```bash
git clone git@github.com:marawangamal/paperz.git
cd git@github.com:marawangamal/paperz.git
npm install
npm run build
```

2. Install Supabase CLI
```bash
brew install supabase/tap/supabase  # macOS
```

3. Start local environment
```bash
docker start
supabase start
```

4. Set up environment
```bash
# Copy the displayed credentials into .env.local:
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-local-anon-key]
```

5. Initialize database
```bash
supabase db reset
```

6. Start app
```bash
npm run dev
```

You should now see it on [http://localhost:3000](http://localhost:3000)

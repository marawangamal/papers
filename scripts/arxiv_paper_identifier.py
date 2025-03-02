import pandas as pd
from tqdm import tqdm
import bs4
import time

import requests

from dataclasses import dataclass


@dataclass
class ArxivPaper:
    title: str
    arxiv_id: str
    arxiv_url: str


def sanitize_title(title: str) -> str:
    return title.replace("-", " ").replace(":", "").replace(".", "").replace("_", " ")


@dataclass
class SearchResult:
    paper: ArxivPaper | None
    error: bool
    not_found: bool | None


def get_arxiv_paper(title, max_results=1) -> SearchResult:

    sanitized_title = sanitize_title(title)

    url = f'http://export.arxiv.org/api/query?search_query=ti:"{sanitized_title}"&sortBy=relevance&max_results={max_results}'

    # Make the API request
    try:
        response = requests.get(url)
    except Exception as e:
        print(f"Error: {e}")
        return SearchResult(paper=None, error=True, not_found=None)

    # the response is in xml, parse it
    soup = bs4.BeautifulSoup(response.text, "xml")

    entry = soup.find("entry")
    if entry is None:
        return SearchResult(paper=None, error=False, not_found=True)

    arxiv_id_tag = entry.find("id")
    if arxiv_id_tag is None:
        return SearchResult(paper=None, error=False, not_found=True)

    # extract the arxiv id from the id tag, ignore the version number
    arxiv_id = arxiv_id_tag.text.split("/")[-1].split("v")[0]
    arxiv_url = f"https://arxiv.org/abs/{arxiv_id}"

    paper = ArxivPaper(title=title, arxiv_id=arxiv_id, arxiv_url=arxiv_url)

    return SearchResult(paper=paper, error=False, not_found=False)


if __name__ == "__main__":
    # Read the CSV file
    df = pd.read_csv("papers_rows.csv")

    # Add 2 new columns to the dataframe, arxiv_id and arxiv_url
    df["arxiv_id"] = None
    df["arxiv_url"] = None

    for idx, row in tqdm(df.iterrows(), total=len(df)):

        print
        title = row["title"]
        start_time = time.time()
        arxiv_paper = get_arxiv_paper(title)

        if arxiv_paper:
            df.loc[idx, "arxiv_id"] = arxiv_paper.arxiv_id
            df.loc[idx, "arxiv_url"] = arxiv_paper.arxiv_url

        df.to_csv("papers_rows_with_arxiv_id.csv", index=False)

        end_time = time.time()

        if end_time - start_time < 3:
            # pause for a total of 3 seconds
            time.sleep(3 - (end_time - start_time))

        if idx > 10:
            break

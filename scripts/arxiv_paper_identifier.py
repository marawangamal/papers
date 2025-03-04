import pandas as pd
from tqdm import tqdm
import bs4
import time
import requests
from dataclasses import dataclass
import argparse

DELAY_SECONDS = 3


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


def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description="Identify arXiv papers from titles in a CSV file"
    )
    parser.add_argument("input_file", help="Input CSV file containing paper titles")
    parser.add_argument(
        "--output",
        "-o",
        help="Output CSV file (defaults to new .csv in current directory)",
    )
    args = parser.parse_args()

    # Determine output file
    output_file = args.output if args.output else "papers_rows_with_arxiv_id.csv"

    df = pd.read_csv(args.input_file)

    for col in ["title", "arxiv_url", "arxiv_id"]:
        assert col in df.columns, f"Column {col} not found in {args.input_file}"

    for idx, row in tqdm(df.iterrows(), total=len(df)):

        if not pd.isna(row["arxiv_id"]) or not pd.isna(row["arxiv_url"]):
            print(f"Skipping {row['title']} because it already has an arxiv id or url")
            continue

        title = row["title"]
        start_time = time.time()
        arxiv_paper = get_arxiv_paper(title)

        if arxiv_paper and not arxiv_paper.error and not arxiv_paper.not_found:
            df.loc[idx, "arxiv_id"] = arxiv_paper.paper.arxiv_id
            df.loc[idx, "arxiv_url"] = arxiv_paper.paper.arxiv_url

        # Save the DataFrame after each update
        df.to_csv(output_file, index=False)

        end_time = time.time()

        # Wait for DELAY_SECONDS between requests
        if end_time - start_time < DELAY_SECONDS:
            time.sleep(DELAY_SECONDS - (end_time - start_time))


if __name__ == "__main__":
    main()
